using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Validator.CompendiumManagement;
using TrueMed.Business.TenantDbContext;
namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ApplicationDbContext _applicationDbContext;
        private IMapper _mapper;
        public DepartmentService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _connectionManager = connectionManager;
            _applicationDbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _utilityService = utilityService;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse<List<DepartmentLookup>>> DepartmentLookupAsync()
        {
            var response = new RequestResponse<List<DepartmentLookup>>();

            var lookupData = await _applicationDbContext.TblDepartments.Select(s => new DepartmentLookup()
            {
                DeptId = s.DeptId,
                DepartmentName = s.DepartmentName

            }).ToListAsync();

            response.Data = lookupData;
            response.Status = "Success";
            response.Message = "Request Processed...";
            response.HttpStatusCode = Status.Success;

            return response;
        }
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

            response.TotalRecord = dataSource.Count();
            response.Result = dataSource;
            return response;
        }
        public async Task<RequestResponse<GetDepartmentDetailResponse>> GetDepartmentDetailByIdAsync(int id)
        {
            var response = new RequestResponse<GetDepartmentDetailResponse>();

            var dataSource = await _applicationDbContext.TblDepartments.Where(f => f.IsDeleted == false).Select(s => new GetDepartmentDetailResponse()
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
            var entity = _mapper.Map<TblDepartment>(request);


            if (entity.DeptId > 0)
            {
                var getRecordForEdit = await _applicationDbContext.TblDepartments.FindAsync(entity.DeptId);
                if (getRecordForEdit != null)
                {

                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;

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

                entity.CreatedBy = LoggedInUser;
                entity.CreatedDate = DateTimeNow.Get;

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
