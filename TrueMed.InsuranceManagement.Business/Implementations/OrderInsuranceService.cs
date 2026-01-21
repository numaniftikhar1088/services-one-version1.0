using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.InsuranceManagement.Business.Interface;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.ResponseModel;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Validator.InsuranceManagement;
using TrueMed.Business.TenantDbContext;
namespace TrueMed.InsuranceManagement.Business.Implementations
{
    public class OrderInsuranceService : IOrderInsuranceService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ApplicationDbContext _dbContext;
        public OrderInsuranceService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor)
        {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _utilityService = utilityService;
            _httpContextAccessor = httpContextAccessor;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }

        public async Task<RequestResponse> SaveOrderInsuranceAsync(OrderInsuranceSaveDto entity)
        {
            var response = new RequestResponse();
            var validator = new OrderInsuranceSaveValidator();
            var isValidated = await validator.ValidateAsync(entity);
            if (isValidated.Errors.Any())
            {
                response.Error = isValidated.Errors.Select(e => e.ErrorMessage);
                response.Message = "Request Failed !";
                response.Status = "Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;
            }
            var convertedEntity = _utilityService.Converstion<OrderInsuranceSaveDto, TblRequisitionPatientInsurance>(entity);
            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            if (convertedEntity.ReqPatInsId > 0)
            {
                var entityForEdit = await _dbContext.TblRequisitionPatientInsurances.FindAsync(convertedEntity.ReqPatInsId);
                if (entityForEdit != null)
                {
                    var createdby = entityForEdit.CreatedBy;
                    var createddate = entityForEdit.CreatedDate;
                    convertedEntity.CreatedDate = createddate;
                    convertedEntity.CreatedBy = createdby;
                    convertedEntity.UpdatedBy = LoggedInUser;
                    convertedEntity.UpdatedDate = DateTimeNow.Get;
                    entityForEdit = convertedEntity;
                    _dbContext.TblRequisitionPatientInsurances.Update(entityForEdit);
                    response.Message = "Record is Updated !";
                }
                else
                {
                    response.Error = $"Record is not exist against ID : {convertedEntity.ReqPatInsId} in our system !";
                    response.Message = "Request Failed !";
                    response.Status = "Failed !";
                    response.HttpStatusCode = Status.Failed;
                    return response;
                }
            }
            else
            {
                convertedEntity.CreatedBy = LoggedInUser;
                convertedEntity.CreatedDate = DateTimeNow.Get;
                await _dbContext.TblRequisitionPatientInsurances.AddAsync(convertedEntity);
                response.Message = "Record is Added !";
            }
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.Status = "Success";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }
        //public async Task<DataQueryResponse<IQueryable<GetOrderInsuranceBriefInfoDto>>> GetOrderInsuranceBriefInfoAsync()
        //{
        //    var response = new DataQueryResponse<IQueryable<GetOrderInsuranceBriefInfoDto>>();
        //    var dataSource = _dbContext.TblPatientInsurances.Select(s => new GetOrderInsuranceBriefInfoDto()
        //    {
        //        CreatedBy = s.CreatedBy,
        //        CreatedDate = s.CreatedDate,
        //        GroupNumber = s.GroupNumber,
        //        InsuranceId = s.InsuranceId,
        //        InsurancePhoneNumbr = s.InsurancePhoneNumbr,
        //        InsuranceProviderId = s.InsuranceProviderId,
        //        IsDeleted = s.IsDeleted,
        //        PatientId = s.PatientId,
        //        PatientInsuranceId = s.PatientInsuranceId,
        //        PolicyId = s.PolicyId,
        //        Sdob = s.Sdob,
        //        Sfname = s.Sfname,
        //        Slname = s.Slname,
        //        Srelation = s.Srelation,
        //        UpdatedBy = s.UpdatedBy,
        //        UpdatedDate = s.UpdatedDate,
        //    }).AsQueryable();
        //    response.Total = dataSource.Count();
        //    response.Data = dataSource;
        //    return response;
        //}
        //public async Task<RequestResponse<GetOrderInsuranceInfoByIdDto>> GetOrderInsuranceInfoByIdAsync(int id)
        //{
        //    var response = new RequestResponse<GetOrderInsuranceInfoByIdDto>();
        //    if (id <= 0)
        //    {
        //        response.Error = $"ID is invalid !";
        //        response.Status = "Failed !";
        //        response.Message = "Request Failed !";
        //        response.HttpStatusCode = Status.Failed;
        //        return response;
        //    }
        //    var result = await _dbContext.TblPatientInsurances.Select(s => new GetOrderInsuranceInfoByIdDto()
        //    {
        //        PatientId = s.PatientId,
        //        CreatedBy = s.CreatedBy,
        //        CreatedDate = s.CreatedDate,
        //        GroupNumber = s.GroupNumber,
        //        InsuranceId = s.InsuranceId,
        //        InsurancePhoneNumbr = s.InsurancePhoneNumbr,
        //        InsuranceProviderId = s.InsuranceProviderId,
        //        IsDeleted = s.IsDeleted,
        //        PatientInsuranceId = s.PatientInsuranceId,
        //        PolicyId = s.PolicyId,
        //        Sdob = s.Sdob,
        //        Sfname = s.Sfname,
        //        Slname = s.Slname,
        //        Srelation = s.Srelation,
        //        UpdatedBy = s.UpdatedBy,
        //        UpdatedDate = s.UpdatedDate
        //    }).FirstOrDefaultAsync(r => r.PatientInsuranceId.Equals(id));

        //    if (result != null)
        //    {
        //        response.Data = result;
        //        response.Message = "Request Processed !";
        //    }
        //    else
        //    {
        //        response.Message = $"Record against ID : {id} is not exist in our system !";
        //    }
        //    response.Status = "Success";
        //    response.HttpStatusCode = Status.Success;
        //    return response;
        //}
        public async Task<RequestResponse> DeleteOrderInsuranceAsync(int id)
        {
            var response = new RequestResponse();
            if (id <= 0)
            {
                response.Error = $"ID is invalid !";
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;
            }
            var result = await _dbContext.TblRequisitionPatientInsurances.FirstOrDefaultAsync(r => r.ReqPatInsId.Equals(id));
            if (result == null)
            {
                response.Error = $"Record is not exist against ID : {id} in our system !";
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;
            }
            result.UpdatedDate = DateTimeNow.Get;
            result.IsDeleted = true;
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.Status = "Success !";
                response.Message = "Record is Deleted !";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }

        //public GetOrderInsuranceBriefInfoDto SearchInsuranceProvider(string q)
        //{

          
         
          


        //}
    }

}
