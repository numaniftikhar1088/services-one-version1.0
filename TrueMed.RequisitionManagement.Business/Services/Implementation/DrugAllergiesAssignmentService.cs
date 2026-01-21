using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.LookUps;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;

namespace TrueMed.RequisitionManagement.Business.Services.Implementation
{
    public class DrugAllergiesAssignmentService : IDrugAllergiesAssignmentService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IMapper _mapper;
        private readonly ILookupManager _lookupManager;
        private MasterDbContext _masterDbContext;
        private ApplicationDbContext _appContext;

        public DrugAllergiesAssignmentService(IConnectionManager connectionManager, IMapper mapper, ILookupManager lookupManager, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _mapper = mapper;
            _lookupManager = lookupManager;

            _masterDbContext = masterDbContext;
            _appContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);
        }

        #region Commands
        public TrueMed.Domain.Models.Response.RequestResponse<int> Save(DrugAllergiesAssignmentRequest.SaveRequest request)
        {
            var response = new TrueMed.Domain.Models.Response.RequestResponse<int>();

            var getLabTypeByRefLabId = _masterDbContext.TblLabs.FirstOrDefault(f => f.LabId == request.RefLabId)?.IsReferenceLab == false ? 0 : 1;

            var entity = _mapper.Map<TblDrugAllergiesAssignment>(request);
            entity.LabType = getLabTypeByRefLabId.ToString();

            if (entity.Id == 0)
            {
                entity.CreatedBy = _connectionManager.UserId;
                entity.CreatedDate = DateTimeNow.Get;

                entity.IsStatus = entity.IsStatus;

                _appContext.TblDrugAllergiesAssignments.Add(entity);
                response.Message = "Drug Allergy Assigned Successfully !";
            }
            else
            {
                var existingEntry = _appContext.TblDrugAllergiesAssignments.AsNoTracking().FirstOrDefault(f => f.Id == entity.Id);
                if (existingEntry != null)
                {
                    var createdBy = existingEntry.CreatedBy;
                    var createdDate = existingEntry.CreatedDate;

                    entity.CreatedBy = createdBy;
                    entity.CreatedDate = createdDate;
                    entity.IsDeleted = existingEntry.IsDeleted;

                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = _connectionManager.UserId;

                    entity.IsStatus = entity.IsStatus;


                }
                _appContext.TblDrugAllergiesAssignments.Update(entity);
                response.Message = "Drug Allergy Assigned Update Successfully !";
            }
            _appContext.SaveChanges();

            response.Data = entity.Id;
            response.StatusCode = HttpStatusCode.OK;

            return response;
        }
        public TrueMed.Domain.Models.Response.RequestResponse StatusChanged(DrugAllergiesAssignmentRequest.StatusChangedRequest request)
        {
            var response = new TrueMed.Domain.Models.Response.RequestResponse();

            var entryForStatusChanged = _appContext.TblDrugAllergiesAssignments.FirstOrDefault(f => f.Id == request.Id);
            if (entryForStatusChanged != null)
                entryForStatusChanged.IsStatus = request.Status;

            _appContext.TblDrugAllergiesAssignments.Update(entryForStatusChanged);
            _appContext.SaveChanges();

            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Drug Allergies Assignment Status Changed !";

            return response;
        }
        public TrueMed.Domain.Models.Response.RequestResponse Delete(int id)
        {
            var response = new TrueMed.Domain.Models.Response.RequestResponse();

            var entryForSoftDel = _appContext.TblDrugAllergiesAssignments.FirstOrDefault(f => f.Id == id);
            if (entryForSoftDel != null)
                entryForSoftDel.IsDeleted = true;

            _appContext.TblDrugAllergiesAssignments.Update(entryForSoftDel);
            _appContext.SaveChanges();

            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Drug Allergies Assignment Deleted Successfully !";

            return response;
        }
        #endregion
        #region Queries
        public DataQueryResponse<List<DrugAllergiesAssignmentResponse.GetAllResponse>> GetAll(DataQueryModel<DrugAllergiesAssignmentQM> query)
        {
            var response = new DataQueryResponse<List<DrugAllergiesAssignmentResponse.GetAllResponse>>();

            #region Source
            var tblDrugAllergiesAssignment = _appContext.TblDrugAllergiesAssignments.ToList();
            var tblLabs = _masterDbContext.TblLabs.ToList();
            var tblFacilities = _appContext.TblFacilities.ToList();
            var tblRequisitions = _appContext.TblLabRequisitionTypes.ToList();
            var tblCompendiumPanel = _appContext.TblCompendiumPanels.ToList();

            var dataSource = (from DAA in tblDrugAllergiesAssignment
                              join Labs in tblLabs on DAA.RefLabId equals Labs.LabId
                              into DAALabs
                              from DAAWithLabs in DAALabs.DefaultIfEmpty()
                              join Facility in tblFacilities on DAA.FacilityId equals Facility.FacilityId
                              into DAAFacility
                              from DAAWithFacility in DAAFacility.DefaultIfEmpty()
                              join Requisition in tblRequisitions on DAA.ReqTypeId equals Requisition.ReqTypeId
                              into DAARequisition
                              from DAAWithRequisition in DAARequisition.DefaultIfEmpty()
                              join Panel in tblCompendiumPanel on DAA.PanelId equals Panel.Id
                              into DAAPanel
                              from DAAWithPanel in DAAPanel.DefaultIfEmpty()
                              select new
                              {
                                  DrugAllergiesAssignmentResult = DAA,
                                  LabResult = DAAWithLabs,
                                  DAAWithFacilityResult = DAAWithFacility,
                                  DAAWithRequisitionResult = DAAWithRequisition,
                                  DAAWithPanelResult = DAAWithPanel
                              })
                              .Select(s => new DrugAllergiesAssignmentResponse.GetAllResponse()
                              {
                                  Id = s.DrugAllergiesAssignmentResult.Id,
                                  Code = s.DrugAllergiesAssignmentResult.Daid,
                                  DrugDescription = s.DrugAllergiesAssignmentResult.DrugName,
                                  RefLabId = s.DrugAllergiesAssignmentResult.RefLabId,
                                  ReferenceLab = s.LabResult != null ? s.LabResult.LaboratoryName : null,
                                  FacilityId = s.DrugAllergiesAssignmentResult.FacilityId,
                                  Facility = s.DAAWithFacilityResult != null ? s.DAAWithFacilityResult.FacilityName : null,
                                  ReqTypeId = s.DrugAllergiesAssignmentResult.ReqTypeId,
                                  Requisition = s.DAAWithRequisitionResult != null ? s.DAAWithRequisitionResult.RequisitionTypeName : null,
                                  PanelId = s.DrugAllergiesAssignmentResult.PanelId,
                                  Panel = s.DAAWithPanelResult != null ? s.DAAWithPanelResult.PanelName : null,
                                  Status = s.DrugAllergiesAssignmentResult.IsStatus
                              }).OrderByDescending(o => o.Id).ToList();
            #endregion

            #region Filter
            if (query.QueryModel?.Id > 0)
                dataSource = dataSource.Where(f => f.Id == query.QueryModel.Id).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.Code))
                dataSource = dataSource.Where(f => f.Code != null && f.Code.Trim().ToLower().Contains(query.QueryModel.Code.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.DrugDescription))
                dataSource = dataSource.Where(f => f.DrugDescription != null && f.DrugDescription.Trim().ToLower().Contains(query.QueryModel.DrugDescription.Trim().ToLower())).ToList();
            if (!string.IsNullOrEmpty(query.QueryModel?.Panel))
                dataSource = dataSource.Where(f => f.Panel != null && f.Panel.Trim().ToLower().Contains(query.QueryModel.Panel.Trim().ToLower())).ToList();

            if (query.QueryModel?.RefLabId > 0)
                dataSource = dataSource.Where(f => f.RefLabId == query.QueryModel.RefLabId).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.ReferenceLab))
                dataSource = dataSource.Where(f => f.ReferenceLab != null && f.ReferenceLab.Trim().ToLower().Contains(query.QueryModel.ReferenceLab.Trim().ToLower())).ToList();

            if (query.QueryModel?.ReqTypeId > 0)
                dataSource = dataSource.Where(f => f.ReqTypeId == query.QueryModel.ReqTypeId).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.Requisition))
                dataSource = dataSource.Where(f => f.Requisition != null && f.Requisition.Trim().ToLower().Contains(query.QueryModel.Requisition.Trim().ToLower())).ToList();

            if (query.QueryModel?.FacilityId > 0)
                dataSource = dataSource.Where(f => f.FacilityId == query.QueryModel.FacilityId).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.Facility))
                dataSource = dataSource.Where(f => f.Facility != null && f.Facility.Trim().ToLower().Contains(query.QueryModel.Facility.Trim().ToLower())).ToList();

            if (query.QueryModel?.PanelId > 0)
                dataSource = dataSource.Where(f => f.PanelId == query.QueryModel.PanelId).ToList();

            if (query.QueryModel?.Status != null)
                dataSource = dataSource.Where(f => f.Status == query.QueryModel.Status).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.Facility))
                dataSource = dataSource.Where(f => f.Panel != null && f.Panel.Trim().ToLower().Contains(query.QueryModel.Panel.Trim().ToLower())).ToList();


            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();

            }
            else
            {
                dataSource = dataSource.AsQueryable().OrderBy($"id desc").ToList();
            }


            response.Total = dataSource.Count();
            if (query.PageNumber > 0 && query.PageSize > 0)
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            #endregion

            response.Data = dataSource;
            response.StatusCode = HttpStatusCode.OK;

            return response;
        }
        public TrueMed.Domain.Models.Response.RequestResponse<DrugAllergiesAssignmentResponse.GetByIdResponse> GetById(int id)
        {
            var response = new TrueMed.Domain.Models.Response.RequestResponse<DrugAllergiesAssignmentResponse.GetByIdResponse>();

            var result = GetAll(new()).Data.AsQueryable();

            var recordById = _mapper.ProjectTo<DrugAllergiesAssignmentResponse.GetByIdResponse>(result).FirstOrDefault(f => f.Id == id);

            response.Data = recordById;
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Request Processed Successfully !";

            return response;
        }
        #endregion

        #region Lookups
        public async Task<List<dynamic>> DrugAllergiesCode_Lookup(string? description)
        {
            return await _lookupManager.DrugAllergiesCode_Lookup(description);
        }
        public async Task<List<CommonLookupResponse>> RequisitionType_Lookup()
        {
            return await _lookupManager.RequisitionType_Lookup();
        }
        public async Task<List<CommonLookupResponse>> GetOnlyReferenceLab_Lookup()
        {
            var response = new List<CommonLookupResponse>();

            var getSystemLookup = await _masterDbContext.TblOptionLookups.Where(f => f.UserType.ToUpper().Trim() == "FACILITY").Select(s => s.Id).ToListAsync();
            var getuserAdminType = Convert.ToInt32(await _masterDbContext.TblUsers.Where(f => f.Id == _connectionManager.UserId).Select(s => s.AdminType).FirstOrDefaultAsync());

            if (getSystemLookup.Contains(getuserAdminType))
            {
                var labIdsByUser = await _masterDbContext.TblLabUsers.Where(f => f.UserId.Equals(_connectionManager.UserId) && f.IsDeleted == false && f.IsActive == true).Select(s => s.LabId).ToListAsync();
                response = await _masterDbContext.TblLabs.Where(f => labIdsByUser.Contains(f.LabId) && f.IsDeleted.Equals(false)).Select(s => new CommonLookupResponse()
                {
                    Value = s.LabId,
                    Label = s.DisplayName

                }).ToListAsync();
            }
            else
            {
                response = await _masterDbContext.TblLabs.Where(f => f.IsDeleted.Equals(false)).Select(s => new CommonLookupResponse()
                {
                    Value = s.LabId,
                    Label = s.DisplayName

                }).ToListAsync();
            }
            return response;
        }
        public async Task<List<FacilityLookupResponse>> Facility_Lookup()
        {
            return await _lookupManager.Facility_Lookup();
        }
        public async Task<List<CommonLookupResponse>> Master_CompendiumPanel_Lookup()
        {
            return await _lookupManager.Master_CompendiumPanel_Lookup();
        }
        #endregion'

    }
}
