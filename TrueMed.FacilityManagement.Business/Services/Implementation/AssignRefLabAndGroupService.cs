using AutoMapper;
using Azure;
using Microsoft.EntityFrameworkCore;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Domain.Models.Response;
using TrueMed.Business.Interface;
using TrueMed.FacilityManagement.Business.Services.Interface;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Response;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;
using TrueMed.FacilityManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;

namespace TrueMed.FacilityManagement.Business.Services.Implementation
{
    public class AssignRefLabAndGroupService : IAssignRefLabAndGroupService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ILookupManager _lookupManager;
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly MasterDbContext _masterDbContext;
        private readonly IMapper _mapper;
        public AssignRefLabAndGroupService(IConnectionManager connectionManager,ILookupManager lookupManager, IMapper mapper, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _applicationDbContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);// ?? throw new ArgumentNullException("Connection String Invalid !");
            _lookupManager = lookupManager;
            _masterDbContext = masterDbContext;
            _mapper = mapper;
        }

        #region Commands
        public RequestResponse Add(AddAssignRefLabAndGroupRequest request)
        {
            var response = new RequestResponse();

            var entity = _mapper.Map<AddAssignRefLabAndGroupRequest, TblFacilityRefLabAssignment>(request);

            entity.CreatedBy = _connectionManager.UserId;
            entity.CreatedDate = DateTimeNow.Get;
            entity.IsDeleted = false;
            entity.IsActive = true;

            var addedEntity = _applicationDbContext.TblFacilityRefLabAssignments.Add(entity).Entity;
            var ack = _applicationDbContext.SaveChanges();
            if (ack > 0)
            {
                response.Message = "Record Added Successfully !";
                response.StatusCode = HttpStatusCode.OK;
                response.Data = addedEntity;
            }
            return response;
        }
        public RequestResponse DeleteById(int id)
        {
            var response = new RequestResponse();

            if (id > 0)
            {
                var existingEntityForSofDelete = _applicationDbContext.TblFacilityRefLabAssignments.AsNoTracking().FirstOrDefault(f => f.Id == id);
                if (existingEntityForSofDelete != null)
                {
                    existingEntityForSofDelete.IsDeleted = true;
                    existingEntityForSofDelete.DeletedDate = DateTimeNow.Get;
                    existingEntityForSofDelete.DeletedBy = _connectionManager.UserId;

                    _applicationDbContext.TblFacilityRefLabAssignments.Update(existingEntityForSofDelete);
                    var ack = _applicationDbContext.SaveChanges();
                    if (ack > 0)
                    {
                        response.Message = "Record Deleted Successfully !";
                        response.StatusCode = HttpStatusCode.OK;
                        response.Data = existingEntityForSofDelete;
                    }
                }
                else
                {
                    response.Message = $"Record:{id} Is Not Exist In Our System !";
                    response.StatusCode = HttpStatusCode.OK;
                }
            }
            else
            {
                response.Message = $"Record:{id} Is Invalid !";
                response.StatusCode = HttpStatusCode.OK;
            }

            return response;
        }
        public RequestResponse Edit(EditAssignRefLabAndGroupRequest request)
        {
            var response = new RequestResponse();

            var existingEntity = _applicationDbContext.TblFacilityRefLabAssignments.AsNoTracking().FirstOrDefault(f => f.Id == request.Id);
            if (existingEntity != null)
            {
                var id = existingEntity.Id;
                var createdBy = existingEntity.CreatedBy;
                var createdDate = existingEntity.CreatedDate;
                var updatedBy = _connectionManager.UserId;
                var updatedDate = DateTimeNow.Get;

                var updatedEntity = _mapper.Map<EditAssignRefLabAndGroupRequest, TblFacilityRefLabAssignment>(request);

                updatedEntity.UpdatedDate = updatedDate;
                updatedEntity.UpdatedBy = updatedBy;
                updatedEntity.CreatedDate = createdDate;
                updatedEntity.CreatedBy = createdBy;
                updatedEntity.IsActive = true;

                _applicationDbContext.TblFacilityRefLabAssignments.Update(updatedEntity);
                var ack = _applicationDbContext.SaveChanges();
                if (ack > 0)
                {
                    response.Message = "Record Updated Successfully !";
                    response.StatusCode = HttpStatusCode.OK;
                    response.Data = updatedEntity;
                }
            }
            else
            {
                response.Message = $"Record:{request.Id} Is Not Exist In Our System !";
                response.StatusCode = HttpStatusCode.OK;
            }
            return response;
        }
        public RequestResponse StatusChanged(StatusChangedAssignRefLabAndGroupRequest request)
        {
            var response = new RequestResponse();

            if (request.Id > 0)
            {
                var existingEntityForStatusChanged = _applicationDbContext.TblFacilityRefLabAssignments.AsNoTracking().FirstOrDefault(f => f.Id == request.Id);
                if (existingEntityForStatusChanged != null)
                {
                    existingEntityForStatusChanged.IsActive = false;

                    _applicationDbContext.TblFacilityRefLabAssignments.Update(existingEntityForStatusChanged);
                    var ack = _applicationDbContext.SaveChanges();
                    if (ack > 0)
                    {
                        response.Message = "Status Changed Successfully !";
                        response.StatusCode = HttpStatusCode.OK;
                        response.Data = existingEntityForStatusChanged;
                    }
                }
                else
                {
                    response.Message = $"Record:{request.Id} Is Not Exist In Our System !";
                    response.StatusCode = HttpStatusCode.OK;
                }
            }
            else
            {
                response.Message = $"Record:{request.Id} Is Invalid !";
                response.StatusCode = HttpStatusCode.OK;
            }

            return response;
        }
        #endregion

        #region Queries

        public async Task<RequestResponse<List<AssignReferenceLabAndGroupResponse>>> GetById(int id)
        {
            var respone = new RequestResponse<List<AssignReferenceLabAndGroupResponse>>();

            var FacilityRefLabAssignmentsResult = await _applicationDbContext.TblFacilityRefLabAssignments.Where(f => f.FacilityId == id).ToListAsync();

            var LabAssignmentsResult = await _applicationDbContext.TblLabAssignments.Where(f => f.IsActive.Equals(true) && f.IsDeleted.Equals(false)).ToListAsync();
            var LabAssignmentGroupsResult = await _applicationDbContext.TblLabAssignmentGroups.ToListAsync();
            var tblLabs = await _masterDbContext.TblLabs.ToListAsync();
            var tblLabRequisitionTypes = await _applicationDbContext.TblLabRequisitionTypes.ToListAsync();
            // tbllab, tbllabrequisition, tblcompendiumgroup


            var dataSource = (from FacilityRefLabAssignments in FacilityRefLabAssignmentsResult
                              join LabAssignments in LabAssignmentsResult on FacilityRefLabAssignments.LabAssignmentId equals LabAssignments.Id
                              into Source_1
                              from FacilityRefLabAssignmentsWithLabAssignments in Source_1.DefaultIfEmpty()
                              join LabAssignmentGroups in LabAssignmentGroupsResult on FacilityRefLabAssignments.LabAssignmentId equals LabAssignmentGroups.LabAssignmentId
                              into Source_2
                              from FacilityRefLabAssignmentsWithLabAssignmentGroups in Source_2.DefaultIfEmpty()
                              select new AssignReferenceLabAndGroupResponse()
                              {
                                  ProfileName = FacilityRefLabAssignmentsWithLabAssignments != null ? FacilityRefLabAssignmentsWithLabAssignments.ProfileName : "",
                                  ReferenceLabName = FacilityRefLabAssignmentsWithLabAssignments != null ? tblLabs.FirstOrDefault(f => f.LabId == FacilityRefLabAssignmentsWithLabAssignments.RefLabId)?.DisplayName : "",
                                  RequisitionTypeName = FacilityRefLabAssignmentsWithLabAssignments != null ? tblLabRequisitionTypes.FirstOrDefault(f => f.ReqTypeId == FacilityRefLabAssignmentsWithLabAssignments.ReqTypeId && f.LabId == FacilityRefLabAssignmentsWithLabAssignments.RefLabId)?.RequisitionTypeName : "",
                                  GroupNames = string.Join(", ", LabAssignmentGroupsResult
                                      .Where(g => g != null && g.LabAssignmentId == FacilityRefLabAssignmentsWithLabAssignments.Id)
                                      .Join(_applicationDbContext.TblCompendiumGroups, g => g.GroupId, cg => cg.Id, (g, cg) => cg.GroupName)),
                                  IsDefault = FacilityRefLabAssignmentsWithLabAssignments.IsDefault,
                              })
                              .GroupBy(d => new { d.ProfileName ,d.ReferenceLabName, d.RequisitionTypeName })
                              .Select(g => g.FirstOrDefault())
                              .ToList();

            respone.Message = "Request Processed Successfully !";
            respone.StatusCode = HttpStatusCode.OK;
            respone.Data = dataSource;
            return respone;
        }

        //public DataQueryResponse<List<AssignReferenceLabAndGroupResponse>> GetAll(DataQueryModel<AssignReferenceLabAndGroupQueryModel>? query)
        //{
        //    var respone = new DataQueryResponse<List<AssignReferenceLabAndGroupResponse>>();

        //    var dataSource = (from ARLAG in _applicationDbContext.TblFacilityRefLabAssignments
        //                      join Labs in _applicationDbContext.TblLabs on ARLAG.RefLabId equals Labs.LabId
        //                      into Source_1
        //                      from ARLAGWithLab in Source_1.DefaultIfEmpty()
        //                      join LabRequisitionType in _applicationDbContext.TblLabRequisitionTypes on ARLAG.ReqTypeId equals LabRequisitionType.ReqTypeId
        //                      into Source_2
        //                      from ARLAGWithLabRequisitionType in Source_2.DefaultIfEmpty()
        //                      join CompendiumGroup in _applicationDbContext.TblCompendiumGroups on ARLAG.GroupId equals CompendiumGroup.Id
        //                      into Source_3
        //                      from ARLAGWithCompendiumGroup in Source_3.DefaultIfEmpty()
        //                      select
        //                      new { AssignRefLabAndGroup = ARLAG, Lab = ARLAGWithLab, RequisitionType = ARLAGWithLabRequisitionType, CompendiumGroup = ARLAGWithCompendiumGroup })
        //                      .Select(s => new AssignReferenceLabAndGroupResponse()
        //                      {
        //                          Id = s.AssignRefLabAndGroup != null ? s.AssignRefLabAndGroup.Id : null,
        //                          ReferenceLab = s.Lab != null ? s.Lab.LaboratoryName : null,
        //                          LabType = s.Lab != null ? s.Lab.IsReferenceLab == true ? "Reference Lab" : "Master Lab" : null,
        //                          Code = s.Lab != null ? s.Lab.LabId : null,
        //                          RequisitionType = s.RequisitionType != null ? s.RequisitionType.RequisitionType : null,
        //                          TestGroup = s.CompendiumGroup != null ? s.CompendiumGroup.GroupName : null,
        //                          Status = s.AssignRefLabAndGroup != null ? s.AssignRefLabAndGroup.IsActive : null
        //                      }).ToList();

        //    respone.Total = dataSource.Count;
        //    #region Filer
        //    if (!string.IsNullOrEmpty(query?.QueryModel?.ReferenceLab))
        //        dataSource = dataSource.Where(f => f.ReferenceLab != null && f.ReferenceLab.Trim().ToLower().Contains(query.QueryModel.ReferenceLab.Trim().ToLower())).ToList();

        //    if (!string.IsNullOrEmpty(query?.QueryModel?.LabType))
        //        dataSource = dataSource.Where(f => f.LabType != null && f.LabType.Trim().ToLower().Contains(query.QueryModel.LabType.Trim().ToLower())).ToList();

        //    if (query?.QueryModel?.Code > 0 && query?.QueryModel?.Code != null)
        //        dataSource = dataSource.Where(f => f.Code != null && f.Code == query.QueryModel.Code).ToList();

        //    if (!string.IsNullOrEmpty(query?.QueryModel?.RequisitionType))
        //        dataSource = dataSource.Where(f => f.RequisitionType != null && f.RequisitionType.Trim().ToLower().Contains(query.QueryModel.RequisitionType.Trim().ToLower())).ToList();

        //    if (!string.IsNullOrEmpty(query?.QueryModel?.TestGroup))
        //        dataSource = dataSource.Where(f => f.TestGroup != null && f.TestGroup.Trim().ToLower().Contains(query.QueryModel.TestGroup.Trim().ToLower())).ToList();

        //    if (query?.QueryModel?.Status != null)
        //        dataSource = dataSource.Where(f => f.Status != null && f.Status == query.QueryModel.Status).ToList();

        //    if (query?.PageNumber > 0 && query?.PageSize > 0)
        //        dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();

        //    #endregion
        //    respone.Filtered = dataSource.Count;
        //    respone.StatusCode = HttpStatusCode.OK;
        //    respone.Data = dataSource;
        //    return respone;
        //}
        //public RequestResponse<AssignReferenceLabAndGroupByIdResponse> GetById(int id)
        //{
        //    var response = new RequestResponse<AssignReferenceLabAndGroupByIdResponse>();

        //    if (id > 0)
        //    {
        //        var record = GetAll(null).Data.FirstOrDefault(f => f.Id == id);
        //        if (record != null)
        //        {
        //            response.Data = new AssignReferenceLabAndGroupByIdResponse()
        //            {
        //                Code = record.Code,
        //                Id = record.Id,
        //                LabType = record.LabType,
        //                ReferenceLab = record.ReferenceLab,
        //                RequisitionType = record.RequisitionType,
        //                Status = record.Status,
        //                TestGroup = record.TestGroup

        //            };
        //            response.StatusCode = HttpStatusCode.OK;
        //            response.Message = "Request Processed Successfully !";
        //        }
        //        else
        //        {
        //            response.StatusCode = HttpStatusCode.OK;
        //            response.Message = $"Record:{id} Is Not Exist In Our System !";
        //        }
        //    }
        //    else
        //    {
        //        response.Message = $"Record ID:{id} Is Invalid !";
        //        response.StatusCode = HttpStatusCode.OK;
        //    }
        //    return response;
        //}

        #endregion

        #region Lookups
        public async Task<List<dynamic>> ReferenceLab_Lookup(int labId)
        {
            return await _lookupManager.ReferenceLab_Lookup(labId);
        }
        public async Task<List<CommonLookupResponse>> RequisitionType_Lookup()
        {
            return await _lookupManager.RequisitionType_Lookup();
        }
        public async Task<List<CommonLookupResponse>> TestGroup_Lookup()
        {
            return await _lookupManager.TestGroup_Lookup();
        }
        #endregion
    }
}
