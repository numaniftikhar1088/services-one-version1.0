using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Validator.MasterPortalAppManagement;
using TrueMed.Business.TenantDbContext;
namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ApplicationDbContext _applicationDbContext;
        private IMapper _mapper;

        public DepartmentService(IHttpContextAccessor httpContextAccessor, ApplicationDbContext applicationDbContext, IConnectionManager connectionManager, IMapper mapper)
        {
            _httpContextAccessor = httpContextAccessor;
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }

        public async Task<DataQueryResponse<List<GetDepartmentDetailResponse>>> GetDepartmentDetailAsync(DataQueryModel<DepartmentQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetDepartmentDetailResponse>>();

            var dataSource = await _applicationDbContext.TblDepartments.Where(f => f.IsDeleted == false).Select(s => new GetDepartmentDetailResponse()
            {
                DeptId = s.DeptId,
                DepartmentName = s.DepartmentName,
                DeptStatus = s.DeptStatus

            }).OrderByDescending(d => d.DeptId).ToListAsync();

            #region Filtered
            if (query.QueryModel?.DeptId > 0)
            {
                dataSource = dataSource.Where(f => f.DeptId.Equals(query.QueryModel.DeptId)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.DepartmentName))
            {
                dataSource = dataSource.Where(f => f.DepartmentName.ToLower().Contains(query.QueryModel?.DepartmentName.ToLower())).ToList();
            }
            if (query.QueryModel?.DeptStatus != null)
            {
                dataSource = dataSource.Where(f => f.DeptStatus.Equals(query.QueryModel.DeptStatus)).ToList();
            }
            #endregion

            response.Total = dataSource.Count();
            response.Data = dataSource;
            return response;
        }
        public async Task<RequestResponse<GetDepartmentDetailByIdResponse>> GetDepartmentDetailByIdAsync(int id)
        {
            var response = new RequestResponse<GetDepartmentDetailByIdResponse>();

            var dataSource = await _applicationDbContext.TblDepartments.Where(f => f.IsDeleted == false).Select(s => new GetDepartmentDetailByIdResponse()
            {
                DeptId = s.DeptId,
                DepartmentName = s.DepartmentName,
                DeptStatus = s.DeptStatus

            }).FirstOrDefaultAsync(d => d.DeptId.Equals(id));

            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Data = dataSource;
            return response;
        }
        public async Task<RequestResponse> SaveDepartmentAsync(SaveDepartmentRequest request)
        {
            var response = new RequestResponse();

            var validation = new SaveDepartmentRequestValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
                response.HttpStatusCode = Status.Failed;
                response.Status = "Validation Failed !";
                response.Message = "Request Failed !";
                return response;
            }

            _applicationDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            var entity = new TblDepartment() 
            {
                 DeptId = request.DeptId,
                 DeptStatus = request.DeptStatus,
                 DepartmentName = request.DepartmentName
            };
            if (entity.DeptId > 0)
            {
                var getRecordForEdit = await _applicationDbContext.TblDepartments.FindAsync(entity.DeptId);
                if (getRecordForEdit != null)
                {

                    //entity.UpdatedDate = DateTimeNow.Get;
                    //entity.UpdatedBy = LoggedInUser;

                    //entity.CreatedDate = getRecordForEdit.CreatedDate;
                    //entity.CreatedBy = getRecordForEdit.CreatedBy;

                    _applicationDbContext.TblDepartments.Update(entity);
                    response.Message = "Record is Updated...";

                }
                else
                {
                    response.Error = $"Record is not exist against ID : {entity.DeptId} in our system...";
                    response.HttpStatusCode = Status.Failed;
                    response.Status = "Failed !";
                    response.Message = "Request Failed !";
                    return response;
                }
            }
            else
            {

                //entity.CreatedBy = LoggedInUser;
                //entity.CreatedDate = DateTimeNow.Get;

                entity.IsDeleted = false;

                if (entity.DeptStatus == null)
                    entity.DeptStatus = true;

                await _applicationDbContext.AddAsync(entity);
                response.Message = "Record is Added...";
            }

            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }
        public async Task<RequestResponse> DeleteDepartmentByIdAsync(int id)
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
            var getRecordForSoftDelete = await _applicationDbContext.TblDepartments.FindAsync(id);
            if (getRecordForSoftDelete != null)
            {
                getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
                getRecordForSoftDelete.DeletedBy = LoggedInUser;

                getRecordForSoftDelete.IsDeleted = true;

                _applicationDbContext.Update(getRecordForSoftDelete);
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
            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }
        public async Task<RequestResponse> ChangeDepartmentStatusAsync(ChangeDepartmentStatusRequest request)
        {
            var response = new RequestResponse();

            var validation = new ChangeDepartmentStatusValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
                response.HttpStatusCode = Status.Failed;
                response.Status = "Validation Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var getRecordForStatusChanged = await _applicationDbContext.TblDepartments.FindAsync(request.DepId);
            if (getRecordForStatusChanged != null)
            {
                getRecordForStatusChanged.UpdatedBy = LoggedInUser;
                getRecordForStatusChanged.UpdatedDate = DateTimeNow.Get;

                getRecordForStatusChanged.DeptStatus = request.DeptStatus;
                _applicationDbContext.Update(getRecordForStatusChanged);
                response.Message = "Status Changed...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {request.DepId} in our system...";
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;

        }
    }
}
