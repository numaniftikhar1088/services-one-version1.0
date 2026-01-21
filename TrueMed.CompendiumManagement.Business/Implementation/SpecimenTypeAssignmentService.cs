using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Validator.CompendiumManagement;
namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class SpecimenTypeAssignmentService : ISpecimenTypeAssignmentService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;
        private ApplicationDbContext _dbContext;
        private MasterDbContext _masterDbContext;
        public SpecimenTypeAssignmentService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor, IMapper mapper, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _utilityService = utilityService;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            LoggedInUser = connectionManager.UserId;
            _masterDbContext = masterDbContext;
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse> SaveSpecimenTypeAssignmentAsync(SpecimenTypeAssignmentRequest request)
        {
            var response = new RequestResponse();

            var validation = new SpecimenTypeAssignmentValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
                response.HttpStatusCode = Status.Failed;
                response.Status = "Validation Failed !";
                response.Message = "Request Failed !";
                return response;
            }

            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

            var entity = new TblPanelTestSpecimenTypeAssignment()
            {
                Id = request.Id,
                ReqTypeId = request.ReqTypeId,
                SpecimenTypeId = request.SpecimenTypeId,
                Isactive = request.Isactive,
            }; //_utilityService.Converstion<SpecimenTypeAssignmentRequest, TblPanelTestSpecimenTypeAssignment>(request);

            if (entity.Id > 0)
            {
                var getRecordForEdit = await _dbContext.TblPanelTestSpecimenTypeAssignments.FindAsync(entity.Id);
                if (getRecordForEdit != null)
                {

                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;
                    entity.Isactive = getRecordForEdit.Isactive;

                    _dbContext.TblPanelTestSpecimenTypeAssignments.Update(entity);

                    var existing = _dbContext.TblPanelSpecimenTypeAssignments.Where(w => w.PanelTestAssignmentId == request.Id);
                    if (existing.Count() > 0)
                    {
                        _dbContext.TblPanelSpecimenTypeAssignments.RemoveRange(existing);
                    }
                    if (request.Panels.Count() > 0)
                    {
                        var list = new List<TblPanelSpecimenTypeAssignment>();
                        foreach (var item in request.Panels)
                        {
                            var obj = new TblPanelSpecimenTypeAssignment()
                            {
                                PanelId = item.PanelId,
                                PanelTestAssignmentId = request.Id
                            };
                            list.Add(obj);
                        }
                        _dbContext.TblPanelSpecimenTypeAssignments.AddRange(list);
                    }

                    response.Message = "Record is Updated...";

                }
                else
                {
                    response.Error = $"Record is not exist against ID : {entity.Id} in our system...";
                    response.HttpStatusCode = Status.Failed;
                    response.Status = "Failed !";
                    response.Message = "Request Failed !";
                    return response;
                }
            }
            else
            {

                entity.CreatedBy = LoggedInUser;
                entity.CreatedDate = DateTimeNow.Get;

                entity.IsDeleted = false;

                if (entity.Isactive == null)
                    entity.Isactive = true;

                await _dbContext.TblPanelTestSpecimenTypeAssignments.AddAsync(entity);
                await _dbContext.SaveChangesAsync();
                if (request.Panels.Count() > 0)
                {
                    var list = new List<TblPanelSpecimenTypeAssignment>();
                    foreach (var item in request.Panels)
                    {
                        var obj = new TblPanelSpecimenTypeAssignment()
                        {
                            PanelId = item.PanelId,
                            PanelTestAssignmentId = entity.Id
                        };
                        list.Add(obj);
                    }
                    _dbContext.TblPanelSpecimenTypeAssignments.AddRange(list);
                }
                response.Message = "Record is Added...";
            }

            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }
        public async Task<DataQueryResponse<List<GetSpecimenTypeAssignmentDetailResponse>>> GetSpecimenTypeAssignmentDetailAsync(DataQueryModel<SpecimenTypeAssignmentQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetSpecimenTypeAssignmentDetailResponse>>();

            #region Source
            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            var panelTestSpecimenTypeAssignmentsResult = await _dbContext.TblPanelTestSpecimenTypeAssignments
             .Where(f => f.IsDeleted.Equals(false)).ToListAsync();

            var requisitionTypeResult = await _dbContext.TblLabRequisitionTypes.Select(s => new { ReqTypeID = s.ReqTypeId, RequisitionTypeName = s.RequisitionTypeName }).ToListAsync();
            var compendiumPanelResult = await _dbContext.TblCompendiumPanels.Where(f => f.IsDeleted.Equals(false)).Select(s => new { Id = s.Id, PanelName = s.PanelName }).ToListAsync();
            var compendiumTestResult = await _dbContext.TblCompendiumTests.Where(f => f.IsDeleted.Equals(false)).Select(s => new { Id = s.Id, TestName = s.TestName }).ToListAsync();
            var specimenTypeResult = await _dbContext.TblSpecimenTypes.Where(f => f.IsDeleted.Equals(false)).Select(s => new { SpecimenTypeId = s.SpecimenTypeId, SpecimenType = s.SpecimenType }).ToListAsync();
            var Panels = await _dbContext.TblPanelSpecimenTypeAssignments.ToListAsync();

            var refLabsResult = await _masterDbContext.TblLabs.Select(s => new { RefLabID = s.LabId, s.DisplayName }).ToListAsync();

            var dataSource = (
                from panelTestSpecimenTypeAssignment in panelTestSpecimenTypeAssignmentsResult
                join requisitionType in requisitionTypeResult on panelTestSpecimenTypeAssignment.ReqTypeId equals requisitionType.ReqTypeID
                into panelTestSpecimenTypeAssignmentrequisitionType
                from ptstaplusrequisitiontype in panelTestSpecimenTypeAssignmentrequisitionType.DefaultIfEmpty()

                    //from panelTestSpecimenTypeAssignment3 in panelTestSpecimenTypeAssignmentsResult
                    //join compendiumTest in compendiumTestResult on panelTestSpecimenTypeAssignment.TestId equals compendiumTest.Id
                    //into panelTestSpecimenTypeAssignmentcompendiumTest
                    //from ptstapluscompendiumTest in panelTestSpecimenTypeAssignmentcompendiumTest.DefaultIfEmpty()

                    // from panelTestSpecimenTypeAssignment in panelTestSpecimenTypeAssignmentsResult
                join specimenType in specimenTypeResult on panelTestSpecimenTypeAssignment.SpecimenTypeId equals specimenType.SpecimenTypeId
                into panelTestSpecimenTypeAssignmentspecimenType
                from ptstaplusspecimenType in panelTestSpecimenTypeAssignmentspecimenType.DefaultIfEmpty()
                select new GetSpecimenTypeAssignmentDetailResponse()
                {
                    Id = panelTestSpecimenTypeAssignment.Id,
                    //PanelDisplayName = gpsAssignment.PanelDisplayName,
                    SpecimenTypeId = panelTestSpecimenTypeAssignment.SpecimenTypeId,
                    SpecimenType = ptstaplusspecimenType == null ? "NA" : ptstaplusspecimenType.SpecimenType,
                    Panels = compendiumPanelResult.Where(f => Panels.Where(w => w.PanelTestAssignmentId == panelTestSpecimenTypeAssignment.Id).Select(s => s.PanelId).Contains(f.Id))
                                  .Select(s => new PanelInfo() { PanelId = s.Id, PanelDisplayName = s.PanelName }).OrderBy(o => o.PanelDisplayName).ToList(),
                    // PanelId = panelTestSpecimenTypeAssignment.PanelId,
                    //PanelDisplayName = ptstapluscompendiumPanel == null ? "NA" : ptstapluscompendiumPanel.PanelName,
                    //TestId = panelTestSpecimenTypeAssignment.TestId,
                    //TestDisplayName = ptstapluscompendiumTest == null ? "NA" : ptstapluscompendiumTest.TestName,
                    ReqTypeId = panelTestSpecimenTypeAssignment.ReqTypeId,
                    RequisitionTypeName = ptstaplusrequisitiontype == null ? "NA" : ptstaplusrequisitiontype.RequisitionTypeName,
                    Isactive = Convert.ToBoolean(panelTestSpecimenTypeAssignment.Isactive),


                }).DistinctBy(d => d.Id).OrderByDescending(d => d.Id).ToList();

            #endregion
            response.TotalRecord = dataSource.Count();
            #region Filtered
            //if (query.QueryModel?.GpsAssignmentId > 0)
            //{
            //    dataSource = dataSource.Where(f => f.GpsAssignmentId.Equals(query.QueryModel.GpsAssignmentId));
            //}
            //if (query.QueryModel?.SpecimenTypeId > 0)
            //{
            //    dataSource = dataSource.Where(f => f.SpecimenTypeId.Equals(query.QueryModel.SpecimenTypeId));
            //}
            if (!string.IsNullOrEmpty(query.QueryModel?.SpecimenType))
            {
                dataSource = dataSource.Where(f => f.SpecimenType != null && f.SpecimenType.ToLower().Contains(query.QueryModel.SpecimenType.ToLower())).ToList();
            }
            //if (!string.IsNullOrEmpty(query.QueryModel?.TestDisplayName))
            //{
            //    dataSource = dataSource.Where(f => f.TestDisplayName != null && f.TestDisplayName.ToLower().Contains(query.QueryModel.TestDisplayName.ToLower())).ToList();
            //}
            //if (!string.IsNullOrEmpty(query.QueryModel?.PanelDisplayName))
            //{
            //    dataSource = dataSource.Where(f => f.PanelDisplayName != null && f.PanelDisplayName.ToLower().Contains(query.QueryModel.PanelDisplayName.ToLower())).ToList();
            //}
            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionTypeName))
            {
                dataSource = dataSource.Where(f => f.RequisitionTypeName != null && f.RequisitionTypeName.ToLower().Contains(query.QueryModel.RequisitionTypeName.ToLower())).ToList();
            }


            if (!string.IsNullOrEmpty(query.QueryModel?.SpecimenType))
            {
                dataSource = dataSource.Where(f => f.SpecimenType.ToLower().Contains(query.QueryModel.SpecimenType.ToLower())).ToList();
            }
            //if (query.QueryModel?.PanelId > 0)
            //{
            //    dataSource = dataSource.Where(f => f.PanelId.Equals(query.QueryModel.PanelId));
            //}
            if (query.QueryModel?.Isactive != null)
            {
                dataSource = dataSource.Where(f => f.Isactive.Equals(query.QueryModel.Isactive)).ToList();
            }


            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();

            }
            else
            {
                dataSource = dataSource.AsQueryable().OrderBy($"id desc").ToList();
            }


            response.TotalRecord = dataSource.Count();
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion
            response.FilteredRecord = dataSource.Count();
            response.Result = dataSource;
            return response;
        }
        public async Task<RequestResponse> DeleteSpecimenTypeAssignmentByIdAsync(int id)
        {
            var response = new RequestResponse();

            if (id <= 0)
            {
                response.Error = "invalid ID !";
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;

            }
            var getRecordForSoftDelete = await _dbContext.TblPanelTestSpecimenTypeAssignments.FindAsync(id);
            if (getRecordForSoftDelete != null)
            {
                getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
                getRecordForSoftDelete.DeletedBy = LoggedInUser;

                getRecordForSoftDelete.IsDeleted = true;

                _dbContext.Update(getRecordForSoftDelete);
                response.Message = "Record Deleted...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {id} in our system...";
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }
        public async Task<RequestResponse> ChangeSpecimenTypeAssignmentStatusAsync(ChangeSpecimenTypeAssignmentStatusRequest request)
        {
            var response = new RequestResponse();

            var validation = new ChangeSpecimenTypeAssignmentStatusValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
                response.HttpStatusCode = Status.Failed;
                response.Status = "Validation Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var getRecordForStatusChanged = await _dbContext.TblPanelTestSpecimenTypeAssignments.FindAsync(request.Id);
            if (getRecordForStatusChanged != null)
            {
                getRecordForStatusChanged.UpdatedBy = LoggedInUser;
                getRecordForStatusChanged.UpdatedDate = DateTimeNow.Get;
                if (request.Isactive == null)
                {
                    request.Isactive = true;
                }
                getRecordForStatusChanged.Isactive = Convert.ToBoolean(request.Isactive);
                _dbContext.Update(getRecordForStatusChanged);
                response.Message = "Status Changed...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {request.Id} in our system...";
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }

        //public async Task<RequestResponse> ImportDataFromExcelToTableAsync(List<SpecimenTypeAssignmentImportFromExcelRequest> request)
        //{
        //    var response = new RequestResponse();

        //    _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

        //    var entities = _mapper.Map<List<TblGpsAssignment>>(request);
        //    foreach (var entity in entities)
        //    {
        //        if (entity.GpsAssignmentId > 0)
        //        {
        //            var getRecordForEdit = await _dbContext.TblGpsAssignments.FindAsync(entity.GpsAssignmentId);
        //            if (getRecordForEdit != null)
        //            {

        //                entity.UpdatedDate = DateTimeNow.Get;
        //                entity.UpdatedBy = LoggedInUser;

        //                entity.CreatedDate = getRecordForEdit.CreatedDate;
        //                entity.CreatedBy = getRecordForEdit.CreatedBy;

        //                _dbContext.TblGpsAssignments.Update(entity);

        //            }
        //        }
        //        else
        //        {

        //            entity.CreatedBy = LoggedInUser;
        //            entity.CreatedDate = DateTimeNow.Get;

        //            entity.IsDeleted = false;

        //            if (entity.Status == null)
        //                entity.Status = true;

        //            await _dbContext.TblGpsAssignments.AddAsync(entity);
        //        }
        //    }
        //    var ack = await _dbContext.SaveChangesAsync();
        //    if (ack > 0)
        //    {
        //        response.Message = "Import Successfully...";
        //        response.HttpStatusCode = Status.Success;
        //        response.Status = "Success !";
        //    }
        //    return response;
        //}


        public async Task<RequestResponse<List<RequisitionTypeLookup>>> RequisitionTypeLookupAsync()
        {
            var response = new RequestResponse<List<RequisitionTypeLookup>>();

            var lookupData = await _dbContext.TblLabRequisitionTypes.Where(f => f.IsDeleted.Equals(false) && f.IsActive.Equals(true) && f.IsSelected.Equals(true)).Select(s => new RequisitionTypeLookup()
            {
                ReqTypeId = s.ReqTypeId,
                RequisitionTypeName = s.RequisitionTypeName

            }).OrderBy(o => o.RequisitionTypeName).ToListAsync();

            response.Data = lookupData;
            response.Status = "Success";
            response.Message = "Request Processed...";
            response.HttpStatusCode = Status.Success;

            return response;

        }
        public Task<RequestResponse> ImportDataFromExcelToTableAsync(List<SpecimenTypeAssignmentImportFromExcelRequest> request)
        {
            throw new NotImplementedException();
        }

        public async Task<RequestResponse<List<SpecimenTypeLookupModel>>> SpecimenTypeLookupAsync()
        {
            var response = new RequestResponse<List<SpecimenTypeLookupModel>>();

            var lookupData = await _dbContext.TblSpecimenTypes.Select(s => new SpecimenTypeLookupModel()
            {
                SpecimenTypeId = s.SpecimenTypeId,
                SpecimenType = s.SpecimenType

            }).OrderBy(o => o.SpecimenType).ToListAsync();

            response.Data = lookupData;
            response.Status = "Success";
            response.Message = "Request Processed...";
            response.HttpStatusCode = Status.Success;

            return response;
        }

        public async Task<RequestResponse<List<TestSetupLookup>>> TestLookupAsync()
        {
            var response = new RequestResponse<List<TestSetupLookup>>();

            var lookupData = await _dbContext.TblCompendiumTests.Select(s => new TestSetupLookup()
            {
                TestId = s.Id,
                TestName = s.TestName

            }).ToListAsync();

            response.Data = lookupData;
            response.Status = "Success";
            response.Message = "Request Processed...";
            response.HttpStatusCode = Status.Success;

            return response;
        }

        public async Task<RequestResponse<List<PanelLookupModel>>> GetPanelsByReqTypeId(int id)
        {
            var response = new RequestResponse<List<PanelLookupModel>>();

            //var compendiumPanelAssignmentsResult = await _dbContext.TblCompendiumPanelAssignments.Where(x => x.RequsitionDispalyType && x.IsActive == true && x.IsDeleted == false).ToListAsync();
            //var compendiumPanelsResult = await _dbContext.TblCompendiumPanels.Where(x => x.ReqTypeId == id && x.IsActive == true && x.IsDeleted == false).ToListAsync();
            //var dataSource=(
            //    from panelTestSpecimenTypeAssignment in compendiumPanelAssignmentsResult
            //    join requisitionType in requisitionTypeResult on panelTestSpecimenTypeAssignment.ReqTypeId equals requisitionType.ReqTypeID
            //    into panelTestSpecimenTypeAssignmentrequisitionType
            //    from ptstaplusrequisitiontype in panelTestSpecimenTypeAssignmentrequisitionType.DefaultIfEmpty()
            //    )
            var lookupData = await _dbContext.TblCompendiumPanels.Where(x => x.ReqTypeId == id && x.IsActive == true && x.IsDeleted == false).Select(s => new PanelLookupModel()
            {
                PanelId = s.Id,//.TblCompendiumPanelAssignmentsDistinctBy(x => x.ParentPanelId).Select(s => s.PanelDisplayName).FirstOrDefault
                PanelDisplayName = _dbContext.TblCompendiumPanelAssignments.FirstOrDefault(x => x.ParentPanelId == s.Id) == null ? "NA" : _dbContext.TblCompendiumPanelAssignments.FirstOrDefault(x => x.ParentPanelId == s.Id).PanelDisplayName

            }).OrderBy(o => o.PanelDisplayName).ToListAsync();

            response.Data = lookupData;
            response.Status = "Success";
            response.Message = "Request Processed...";
            response.HttpStatusCode = Status.Success;

            return response;
        }
    }
}
