using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.FacilityManagement.Business.Services.Interface;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Response;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;
using TrueMed.FacilityManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
namespace TrueMed.FacilityManagement.Business.Services.Implementation
{

    public class LabFacInsTypeAssignmentService : ILabFacInsTypeAssignmentService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConnectionManager _connectionManager;
        private ApplicationDbContext _appDbContext;
        private MasterDbContext _masterDbContext;
        private IMapper _mapper;

        public LabFacInsTypeAssignmentService(IHttpContextAccessor httpContextAccessor, MasterDbContext masterDbContext, IConnectionManager connectionManager, IMapper mapper)
        {
            _connectionManager = connectionManager;
            _httpContextAccessor = httpContextAccessor;
            _appDbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _masterDbContext = masterDbContext;
            _mapper = mapper;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse> ChangeLabFacInsTypeAssignementStatusAsync(ChangeLabFacInsTypeAssignementStatusRequest request)
        {
            var response = new RequestResponse();

            var getRecordForStatusChanged = await _appDbContext.TblLabFacInsAssignments.FindAsync(request.LfiAssignmentId);
            if (getRecordForStatusChanged != null)
            {
                getRecordForStatusChanged.UpdatedBy = LoggedInUser;
                getRecordForStatusChanged.UpdatedDate = DateTimeNow.Get;

                getRecordForStatusChanged.Status = request.Status;
                _appDbContext.Update(getRecordForStatusChanged);
                response.ResponseMessage = "Status Changed...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {request.LfiAssignmentId} in our system...";
                response.StatusCode = Status.Failed;
                response.ResponseStatus = "Failed !";
                response.ResponseMessage = "Request Failed !";
                return response;
            }
            var ack = await _appDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.StatusCode = Status.Success;
                response.ResponseStatus = "Success !";
            }
            return response;
        }

        public async Task<RequestResponse> DeleteLabFacInsTypeAssignementByIdAsync(int id)
        {
            var response = new RequestResponse();

            if (id <= 0)
            {
                response.Error = "invalid ID !";
                response.ResponseStatus = "Failed";
                response.ResponseMessage = "Request Failed !";
                response.StatusCode = Status.Failed;
                return response;

            }
            var getRecordForSoftDelete = await _appDbContext.TblLabFacInsAssignments.FindAsync(id);
            if (getRecordForSoftDelete != null)
            {
                getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
                getRecordForSoftDelete.DeletedBy = LoggedInUser;

                getRecordForSoftDelete.IsDeleted = true;

                _appDbContext.Update(getRecordForSoftDelete);
                response.ResponseMessage = "Record Deleted...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {id} in our system...";
                response.StatusCode = Status.Failed;
                response.ResponseStatus = "Failed !";
                response.ResponseMessage = "Request Failed !";
                return response;
            }
            var ack = await _appDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.StatusCode = Status.Success;
                response.ResponseStatus = "Success !";
            }
            return response;
        }

        public async Task<DataQueryResponse<List<GetLabFacInsTypeAssignementDetailResponse>>> GetLabFacInsTypeAssignementDetailAsync(DataQueryModel<LabFacInsTypeAssignementQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetLabFacInsTypeAssignementDetailResponse>>();

            #region Source
            var LabFacInsAssignmentData = await _appDbContext.TblLabFacInsAssignments.Select(s =>
            new
            {
                //LFI_AssignementID = s.LfiAssignmentId,
                RefLabID = s.RefLabId,
                LabType = s.LabType,
                FacilityID = s.FacilityId,
                ReqTypeID = s.ReqTypeId,
                GroupID = s.GroupId,
                InsuranceID = s.InsuranceId,
                Gender = s.Gender,
                Status = s.Status

            }).ToListAsync();
            var refLabData = await _masterDbContext.TblLabs.Select(s => new { LabId = s.LabId, LaboratoryName = s.LaboratoryName }).ToListAsync();
            var facilityData = await _appDbContext.TblFacilities.Select(s => new { FacilityId = s.FacilityId, FacilityName = s.FacilityName }).ToListAsync();
            var requisitionTypeData = await _masterDbContext.TblRequisitionTypes.Select(s => new { RequisitionTypeId = s.ReqTypeId, RequisitionTypeName = s.RequisitionTypeName }).ToListAsync();
            var groupData = await _appDbContext.TblCompendiumGroups.Select(s => new { GroupId = s.Id, GroupName = s.GroupName }).ToListAsync();
            var insuranceData = await _masterDbContext.TblInsuranceSetups.Select(s => new { InsuranceId = s.InsuranceId, InsuranceName = s.InsuranceName }).ToListAsync();
            #endregion
            #region Query
            var dataSource = (from LabFacInsAssignment in LabFacInsAssignmentData
                              join refLab in refLabData on LabFacInsAssignment.RefLabID equals refLab.LabId
                              into LabFacInsAssignmentrefLab
                              from LabFacInsAssignmentPlusrefLab in LabFacInsAssignmentrefLab.DefaultIfEmpty()
                              join facility in facilityData on LabFacInsAssignment.FacilityID equals facility.FacilityId
                              into LabFacInsAssignmentfacility
                              from LabFacInsAssignmentPlusfacility in LabFacInsAssignmentfacility.DefaultIfEmpty()
                              join requisitionType in requisitionTypeData on LabFacInsAssignment.ReqTypeID equals requisitionType.RequisitionTypeId
                              into LabFacInsAssignmentrequisitionType
                              from LabFacInsAssignmentPlusrequisitionType in LabFacInsAssignmentrequisitionType.DefaultIfEmpty()
                              join groupResult in groupData on LabFacInsAssignment.GroupID equals groupResult.GroupId
                              into LabFacInsAssignmentgroupResult
                              from LabFacInsAssignmentPlusgroupResult in LabFacInsAssignmentgroupResult.DefaultIfEmpty()
                              join insurance in insuranceData on LabFacInsAssignment.InsuranceID equals insurance.InsuranceId
                              into LabFacInsAssignmentinsurance
                              from LabFacInsAssignmentPlusinsurance in LabFacInsAssignmentinsurance.DefaultIfEmpty()
                              select new GetLabFacInsTypeAssignementDetailResponse()
                              {
                                  //LfiAssignmentId = LabFacInsAssignment.LFI_AssignementID,
                                  RefLabId = LabFacInsAssignment.RefLabID,
                                  LaboratoryName = LabFacInsAssignmentPlusrefLab == null ? "NA" : LabFacInsAssignmentPlusrefLab.LaboratoryName,
                                  LabType = LabFacInsAssignment.LabType,
                                  FacilityId = LabFacInsAssignment.FacilityID,
                                  FacilityName = LabFacInsAssignmentPlusfacility == null ? "NA" : LabFacInsAssignmentPlusfacility.FacilityName,
                                  ReqTypeId = LabFacInsAssignment.ReqTypeID,
                                  RequisitionTypeName = LabFacInsAssignmentPlusrequisitionType == null ? "NA" : LabFacInsAssignmentPlusrequisitionType.RequisitionTypeName,
                                  GroupId = LabFacInsAssignment.GroupID,
                                  GroupName = LabFacInsAssignmentPlusgroupResult == null ? "NA" : LabFacInsAssignmentPlusgroupResult.GroupName,
                                  InsuranceId = LabFacInsAssignment.InsuranceID,
                                  InsuranceName = LabFacInsAssignmentPlusinsurance == null ? "NA" : LabFacInsAssignmentPlusinsurance.InsuranceName,
                                  Gender = LabFacInsAssignment.Gender,
                                  Status = LabFacInsAssignment.Status
                              }).DistinctBy(d => d.LfiAssignmentId).OrderByDescending(o => o.LfiAssignmentId).ToList();
            #endregion
            #region Filtered
            if (query.QueryModel?.LfiAssignmentId > 0)
            {
                dataSource = dataSource.Where(f => f.LfiAssignmentId.Equals(query.QueryModel?.LfiAssignmentId)).ToList();
            }
            if (query.QueryModel?.RefLabId > 0)
            {
                dataSource = dataSource.Where(f => f.RefLabId.Equals(query.QueryModel?.RefLabId)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LaboratoryName))
            {
                dataSource = dataSource.Where(f => f.LaboratoryName.ToLower().Contains(query.QueryModel?.LaboratoryName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LabType))
            {
                dataSource = dataSource.Where(f => f.LabType.ToLower().Contains(query.QueryModel?.LabType.ToLower())).ToList();
            }
            if (query.QueryModel?.FacilityId > 0)
            {
                dataSource = dataSource.Where(f => f.FacilityId.Equals(query.QueryModel?.FacilityId)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.FacilityName))
            {
                dataSource = dataSource.Where(f => f.FacilityName.ToLower().Contains(query.QueryModel?.FacilityName.ToLower())).ToList();
            }
            if (query.QueryModel?.ReqTypeId > 0)
            {
                dataSource = dataSource.Where(f => f.ReqTypeId.Equals(query.QueryModel?.ReqTypeId)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionTypeName))
            {
                dataSource = dataSource.Where(f => f.RequisitionTypeName.ToLower().Contains(query.QueryModel?.RequisitionTypeName.ToLower())).ToList();
            }
            if (query.QueryModel?.GroupId > 0)
            {
                dataSource = dataSource.Where(f => f.GroupId.Equals(query.QueryModel?.GroupId)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.GroupName))
            {
                dataSource = dataSource.Where(f => f.GroupName.ToLower().Contains(query.QueryModel?.GroupName.ToLower())).ToList();
            }
            if (query.QueryModel?.InsuranceId > 0)
            {
                dataSource = dataSource.Where(f => f.InsuranceId.Equals(query.QueryModel?.InsuranceId)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.InsuranceName))
            {
                dataSource = dataSource.Where(f => f.InsuranceName.ToLower().Contains(query.QueryModel?.InsuranceName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Gender))
            {
                dataSource = dataSource.Where(f => f.Gender.ToLower().Contains(query.QueryModel?.Gender.ToLower())).ToList();
            }
            if (query.QueryModel?.Status != null)
            {
                dataSource = dataSource.Where(f => f.Status.Equals(query.QueryModel?.Status)).ToList();
            }
            #endregion
            response.Data = dataSource;
            response.Total = dataSource.Count;
            return response;
        }

        public async Task<RequestResponse<GetLabFacInsTypeAssignementDetailByIdResponse>> GetLabFacInsTypeAssignementDetailByIdAsync(int id)
        {
            var response = new RequestResponse<GetLabFacInsTypeAssignementDetailByIdResponse>();

            #region Source
            var LabFacInsAssignmentData = await _appDbContext.TblLabFacInsAssignments.Select(s =>
            new
            {
                //LFI_AssignementID = s.LfiAssignmentId,
                RefLabID = s.RefLabId,
                LabType = s.LabType,
                FacilityID = s.FacilityId,
                ReqTypeID = s.ReqTypeId,
                GroupID = s.GroupId,
                InsuranceID = s.InsuranceId,
                Gender = s.Gender,
                Status = s.Status

            }).ToListAsync();
            var refLabData = await _masterDbContext.TblLabs.Select(s => new { LabId = s.LabId, LaboratoryName = s.LaboratoryName }).ToListAsync();
            var facilityData = await _appDbContext.TblFacilities.Select(s => new { FacilityId = s.FacilityId, FacilityName = s.FacilityName }).ToListAsync();
            var requisitionTypeData = await _masterDbContext.TblRequisitionTypes.Select(s => new { RequisitionTypeId = s.ReqTypeId, RequisitionTypeName = s.RequisitionTypeName }).ToListAsync();
            var groupData = await _appDbContext.TblCompendiumGroups.Select(s => new { GroupId = s.Id, GroupName = s.GroupName }).ToListAsync();
            var insuranceData = await _masterDbContext.TblInsuranceSetups.Select(s => new { InsuranceId = s.InsuranceId, InsuranceName = s.InsuranceName }).ToListAsync();
            #endregion
            #region Query
            var dataSource = (from LabFacInsAssignment in LabFacInsAssignmentData
                              join refLab in refLabData on LabFacInsAssignment.RefLabID equals refLab.LabId
                              into LabFacInsAssignmentrefLab
                              from LabFacInsAssignmentPlusrefLab in LabFacInsAssignmentrefLab.DefaultIfEmpty()
                              join facility in facilityData on LabFacInsAssignment.FacilityID equals facility.FacilityId
                              into LabFacInsAssignmentfacility
                              from LabFacInsAssignmentPlusfacility in LabFacInsAssignmentfacility.DefaultIfEmpty()
                              join requisitionType in requisitionTypeData on LabFacInsAssignment.ReqTypeID equals requisitionType.RequisitionTypeId
                              into LabFacInsAssignmentrequisitionType
                              from LabFacInsAssignmentPlusrequisitionType in LabFacInsAssignmentrequisitionType.DefaultIfEmpty()
                              join groupResult in groupData on LabFacInsAssignment.GroupID equals groupResult.GroupId
                              into LabFacInsAssignmentgroupResult
                              from LabFacInsAssignmentPlusgroupResult in LabFacInsAssignmentgroupResult.DefaultIfEmpty()
                              join insurance in insuranceData on LabFacInsAssignment.InsuranceID equals insurance.InsuranceId
                              into LabFacInsAssignmentinsurance
                              from LabFacInsAssignmentPlusinsurance in LabFacInsAssignmentinsurance.DefaultIfEmpty()
                              select new GetLabFacInsTypeAssignementDetailByIdResponse()
                              {
                                  //LfiAssignmentId = LabFacInsAssignment.LFI_AssignementID,
                                  RefLabId = LabFacInsAssignment.RefLabID,
                                  LaboratoryName = LabFacInsAssignmentPlusrefLab == null ? "NA" : LabFacInsAssignmentPlusrefLab.LaboratoryName,
                                  LabType = LabFacInsAssignment.LabType,
                                  FacilityId = LabFacInsAssignment.FacilityID,
                                  FacilityName = LabFacInsAssignmentPlusfacility == null ? "NA" : LabFacInsAssignmentPlusfacility.FacilityName,
                                  ReqTypeId = LabFacInsAssignment.ReqTypeID,
                                  RequisitionTypeName = LabFacInsAssignmentPlusrequisitionType == null ? "NA" : LabFacInsAssignmentPlusrequisitionType.RequisitionTypeName,
                                  GroupId = LabFacInsAssignment.GroupID,
                                  GroupName = LabFacInsAssignmentPlusgroupResult == null ? "NA" : LabFacInsAssignmentPlusgroupResult.GroupName,
                                  InsuranceId = LabFacInsAssignment.InsuranceID,
                                  InsuranceName = LabFacInsAssignmentPlusinsurance == null ? "NA" : LabFacInsAssignmentPlusinsurance.InsuranceName,
                                  Gender = LabFacInsAssignment.Gender,
                                  Status = LabFacInsAssignment.Status
                              }).FirstOrDefault(f => f.LfiAssignmentId.Equals(id));
            #endregion
            response.Data = dataSource;
            response.StatusCode = Status.Success;
            response.ResponseMessage = "Request Processed...";
            response.ResponseStatus = "Success";
            return response;
        }

        public async Task<RequestResponse> SaveLabFacInsTypeAssignementAsync(SaveLabFacInsTypeAssignementRequest request)
        {
            var response = new RequestResponse();

            _appDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            var entity = _mapper.Map<TblLabFacInsAssignment>(request);

            if (entity.Id > 0)
            {
                var getRecordForEdit = await _appDbContext.TblLabFacInsAssignments.FindAsync(entity.Id);
                if (getRecordForEdit != null)
                {

                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;

                    _appDbContext.TblLabFacInsAssignments.Update(entity);
                    response.ResponseMessage = "Record is Updated...";

                }
                else
                {
                    response.Error = $"Record is not exist against ID : {entity.Id} in our system...";
                    response.StatusCode = Status.Failed;
                    response.ResponseStatus = "Failed !";
                    response.ResponseMessage = "Request Failed !";
                    return response;
                }
            }
            else
            {

                entity.CreatedBy = LoggedInUser;
                entity.CreatedDate = DateTimeNow.Get;

                entity.IsDeleted = false;

                if (entity.Status == null)
                    entity.Status = true;

                await _appDbContext.AddAsync(entity);
                response.ResponseMessage = "Record is Added...";
            }

            var ack = await _appDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.StatusCode = Status.Success;
                response.ResponseStatus = "Success !";
            }
            return response;
        }
    }
}
