using AutoMapper;
using FluentValidation;
using Microsoft.AspNet.Identity;
using Microsoft.EntityFrameworkCore;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;
using TrueMed.Sevices.MasterEntities;
using TrueMed.Business.MasterDBContext;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation
{
    public class RequisitionTypeService : IRequisitionTypeService
    {
        private readonly IConnectionManager _connectionManager;
        private MasterDbContext _masterDbContext;
        private IMapper _mapper;

        public RequisitionTypeService(IConnectionManager connectionManager, MasterDbContext masterDbContext,IMapper mapper)
        {
            _connectionManager = connectionManager;
            _masterDbContext = masterDbContext;
            _mapper = mapper;
            LoggedInUser = connectionManager.UserId;
        }
        public string LoggedInUser { get; set; }

        public async Task<DataQueryResponse<List<GetRequisitionTypeResponse>>> GetRequisitionTypesAsync(DataQueryModel<RequisitionTypeQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetRequisitionTypeResponse>>();

            #region DataSource
            var RequisitionTypeResult = await _masterDbContext.TblRequisitionTypes.Where(f => f.IsDeleted.Equals(false)).ToListAsync();
            //var requisitionTypeResult = await _masterDbContext.ooTblRequisitionTypes.ToListAsync();
            //var departmentResult = await _masterDbContext.TblDepartments.Where(x => x.IsDeleted.Equals(false)).ToListAsync();
            #endregion

            var dataSource = (from requisitionType in RequisitionTypeResult.DefaultIfEmpty()
                                  //join requisitionType in requisitionTypeResult on testSetup.ReqTypeId equals requisitionType.ReqTypeId
                                  //into panelSetuprequisitionType
                                  //from panelSetupPlusrequisitionType in panelSetuprequisitionType.DefaultIfEmpty()
                                  //join department in departmentResult on testSetup.DeptId equals department.DeptId
                                  //into panelSetupdepartment
                                  //from panelSetupPlusdepartment in panelSetupdepartment.DefaultIfEmpty()
                              select new GetRequisitionTypeResponse()
                              {
                                  ReqTypeId = requisitionType.ReqTypeId,
                                  RequisitionType = requisitionType.RequisitionType,
                                  RequisitionTypeName = requisitionType.RequisitionTypeName,
                                  RequisitionColor = requisitionType.RequisitionColor,
                                  ReqStatus = requisitionType.ReqStatus
                              }).DistinctBy(d => d.ReqTypeId).OrderByDescending(o => o.ReqTypeId).ToList();

            #region Filtered
            //if (query.QueryModel?.TestId > 0)
            //{
            //    dataSource = dataSource.Where(f => f.TestId.Equals(query.QueryModel.TestId)).ToList();
            //}
            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionTypeName))
            {
                dataSource = dataSource.Where(f => f.RequisitionTypeName != null && f.RequisitionTypeName.ToLower().Contains(query.QueryModel?.RequisitionTypeName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionType))
            {
                dataSource = dataSource.Where(f => f.RequisitionType != null && f.RequisitionType.ToLower().Contains(query.QueryModel?.RequisitionType.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionColor))
            {
                dataSource = dataSource.Where(f => f.RequisitionColor != null && f.RequisitionColor.ToLower().Contains(query.QueryModel?.RequisitionColor.ToLower())).ToList();
            }
            if (query.QueryModel?.ReqStatus != null)
            {
                dataSource = dataSource.Where(f => f.ReqStatus.Equals(query.QueryModel.ReqStatus)).ToList();
            }
            response.Total = dataSource.Count();
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion

            response.Data = dataSource;
            return response;
        }
        public async Task<bool> IsRequisitionNameValid(string name)
        {
            var IsRequitionNameNotUnique =  _masterDbContext.TblRequisitionTypes.Any(x => x.RequisitionTypeName.Trim().ToLower() == name.Trim().ToLower());
            if (IsRequitionNameNotUnique)
                return false;
            else
                return true;
        }
        public async Task<RequestResponse> SaveRequisitionTypeAsync(SaveRequisitionTypeRequest request)
        {
            var response = new RequestResponse();

            _masterDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            var entity = _mapper.Map<TblRequisitionType>(request);

            if (entity.ReqTypeId > 0)
            {
                var getRecordForEdit = await _masterDbContext.TblRequisitionTypes.FindAsync(entity.ReqTypeId);
                if (getRecordForEdit != null)
                {
                    //entity.TestDisplayName = entity.TestName;

                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;

                    _masterDbContext.TblRequisitionTypes.Update(entity);
                    response.Message = "Record is Updated...";

                }
                else
                {
                    response.Error = $"Record is not exist against ID : {entity.ReqTypeId} in our system...";
                    response.HttpStatusCode = Status.Failed;
                    response.Status = "Failed !";
                    response.Message = "Request Failed !";
                    return response;
                }
            }
            else
            {

                //entity.TestDisplayName = entity.TestName;

                entity.CreatedBy = LoggedInUser;
                entity.CreatedDate = DateTimeNow.Get;

                entity.IsDeleted = false;

                if (entity.ReqStatus == null)
                    entity.ReqStatus = true;

                await _masterDbContext.AddAsync(entity);
                response.Message = "Record is Added...";
            }

            var ack = await _masterDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }

        public async Task<RequestResponse> ChangeRequisitionTypeStatusAsync(ChangeRequisitionTypeStatusRequest request)
        {
            var response = new RequestResponse();

            //var validation = new ChangeTestSetupStatusValidator();
            //var validate = await validation.ValidateAsync(request);

            //if (!validate.IsValid)
            //{
            //    response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
            //    response.HttpStatusCode = Status.Failed;
            //    response.Status = "Validation Failed !";
            //    response.Message = "Request Failed !";
            //    return response;
            //}
            var getRecordForStatusChanged = await _masterDbContext.TblRequisitionTypes.FindAsync(request.ReqTypeId);
            if (getRecordForStatusChanged != null)
            {
                getRecordForStatusChanged.UpdatedBy = LoggedInUser;
                getRecordForStatusChanged.UpdatedDate = DateTimeNow.Get;

                getRecordForStatusChanged.ReqStatus = request.ReqStatus;
                _masterDbContext.Update(getRecordForStatusChanged);
                response.Message = "Status Changed...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {request.ReqTypeId} in our system...";
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var ack = await _masterDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;

        }

        public async Task<RequestResponse> DeleteRequisitionTypeByIdAsync(int id)
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
            var getRecordForSoftDelete = await _masterDbContext.TblRequisitionTypes.FindAsync(id);
            if (getRecordForSoftDelete != null)
            {
                getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
                getRecordForSoftDelete.DeletedBy = LoggedInUser;

                getRecordForSoftDelete.IsDeleted = true;

                _masterDbContext.Update(getRecordForSoftDelete);
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
            var ack = await _masterDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }
    }
}
