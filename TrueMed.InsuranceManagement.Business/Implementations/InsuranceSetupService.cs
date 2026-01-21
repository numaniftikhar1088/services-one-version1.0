using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Domain.Databases;
using TrueMed.Business.Interface;
using TrueMed.InsuranceManagement.Business.Interface;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.Validator.InsuranceManagement;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using Status = TrueMed.Domain.Model.Identity.Status;
using TrueMed.InsuranceManagement.Domain.Dtos;
using Microsoft.AspNet.Identity;
using TrueMed.InsuranceManagement.Domains.ResponseModel;
using System.Linq.Dynamic;
using TrueMed.Sevices.MasterEntities;
using Azure;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Graph;
using TrueMed.Business.MasterDBContext;

namespace TrueMed.InsuranceManagement.Business.Implementations
{
    public class InsuranceSetupService : IInsuranceSetupService
    {
        private readonly IUtilityService _utilityService;
        private readonly IConnectionManager _connectionManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        //private ApplicationDbContext _appdbContext;
        private MasterDbContext _dbContext;

        public InsuranceSetupService(IUtilityService utilityService, IConnectionManager connectionManager, IHttpContextAccessor httpContextAccessor, MasterDbContext dbContext)
        {
            _utilityService = utilityService;
            _connectionManager = connectionManager;
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
            //_appdbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse> SaveInsuranceSetupAsync(SaveInsuranceSetupDto saveInsuranceTypeDto)
        {
            var response = new RequestResponse();
            SaveInsuranceTypeValidator validator = new SaveInsuranceTypeValidator();
            var validate = await validator.ValidateAsync(saveInsuranceTypeDto);
            if (validate.Errors.Any())
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage);
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;
            }
            var entity = _utilityService.Converstion<SaveInsuranceSetupDto, TblInsuranceSetup>(saveInsuranceTypeDto);
            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            if (entity.InsuranceId > 0)
            {
                var recordBeforeEdit = await _dbContext.TblInsuranceSetups.FirstOrDefaultAsync(r => r.InsuranceId.Equals(entity.InsuranceId));
                if (recordBeforeEdit != null)
                {
                    if (!entity.InsuranceName.Equals(recordBeforeEdit.InsuranceName))
                    {
                        if (!IsInsuranceNameUnique(entity.InsuranceName))
                        {
                            response.Message = "Request Failed !";
                            response.Status = "Failed !";
                            response.HttpStatusCode = Status.Failed;
                            response.Error = $"Insurance Name : {entity.InsuranceName} is exist in our system please use another Insurance Name !";
                            return response;
                        }
                    }
                    entity.UpdatedBy = LoggedInUser;
                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.CreatedBy = recordBeforeEdit.CreatedBy;
                    entity.CreatedDate = recordBeforeEdit.CreatedDate;
                    recordBeforeEdit = entity;
                    _dbContext.TblInsuranceSetups.Update(recordBeforeEdit);
                    response.Message = "Record is Updated !";
                }
                else
                {
                    response.Status = "Failed";
                    response.HttpStatusCode = Status.Failed;
                    response.Message = "Request Failed !";
                    response.Error = "Record is not exist in our system !";
                    return response;
                }
            }
            else
            {
                entity.CreatedBy = LoggedInUser;
                entity.CreatedDate = DateTimeNow.Get;
                if (IsInsuranceNameUnique(entity.InsuranceName))
                {
                    await _dbContext.TblInsuranceSetups.AddAsync(entity);
                    response.Message = "Record is Added !";
                }
                else
                {
                    response.Message = "Request Failed !";
                    response.Status = "Failed !";
                    response.HttpStatusCode = Status.Failed;
                    response.Error = $"Insurance Name : {entity.InsuranceName} is exist in our system please use another Insurance Name !";
                    return response;
                }
            }
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.Status = "Success";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }
        public async Task<RequestResponse> ChangeInsuranceSetupStatusAsync(ChangeInsuranceSetupStatusDto statusChangeDto)
        {
            var response = new RequestResponse();
            ChangeInsuranceSetupStatusValidator validation = new ChangeInsuranceSetupStatusValidator();
            var validate = await validation.ValidateAsync(statusChangeDto);
            if (validate.Errors.Any())
            {
                response.Error = validate.Errors.Select(e => e.ErrorMessage);
                response.Status = "Validation Failed !";
                response.HttpStatusCode = Status.Failed;
                response.Message = "Request failed !";
                return response;
            }
            var recordForStatusChange = await _dbContext.TblInsuranceSetups.FindAsync(statusChangeDto.InsuranceId);
            if (recordForStatusChange != null)
            {
                recordForStatusChange.UpdatedDate = DateTimeNow.Get;
                recordForStatusChange.UpdatedBy = LoggedInUser;
                recordForStatusChange.InsuranceStatus = statusChangeDto.NewStatus;
                _dbContext.TblInsuranceSetups.Update(recordForStatusChange);
                response.Message = "Status Changed !";
            }
            else
            {
                response.Status = "Failed";
                response.HttpStatusCode = Status.Failed;
                response.Message = "Request Failed !";
                response.Error = "Record is not exist in our system !";
            }
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.Status = "Success";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }
        public async Task<DataQueryResponse<IQueryable>> GetInsuranceSetupAsync(DataQueryModel<InsuranceSetupQueryModel> dataQueryModel)
        {
            var response = new DataQueryResponse<IQueryable>();
            if (true)
            {

            }
            response.Total = response.Data.Count();
            return response;
        }
        public async Task<RequestResponse<GetInsuranceSetupByIdDto>> GetInsuranceSetupByIdAsync(int id)
        {
            var response = new RequestResponse<GetInsuranceSetupByIdDto>();
            if (id <= 0)
            {
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.Error = "ID is invalid !";
                return response;
            }
            var resultData = await _dbContext.TblInsuranceSetups.Select(s => new GetInsuranceSetupByIdDto()
            {
                 InsuranceId = s.InsuranceId,
                 InsuranceName = s.InsuranceName,
                 InsuranceStatus = s.InsuranceStatus,
                 InsuranceType = s.InsuranceType
                  
            }).FirstOrDefaultAsync(f => f.InsuranceId.Equals(id));
            if (resultData == null)
            {
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.Error = $"Record is not exist against ID : {id} in our system !"; ;
                return response;
            }
            response.Data = resultData;
            response.HttpStatusCode = Status.Success;
            response.Status = "Success";
            response.Message = "Request Processed !";
            return response;
        }
        public async Task<RequestResponse> DeleteInsuranceSetupByIdAsync(int id)
        {
            var response = new RequestResponse();
            if (id <= 0)
            {
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.Error = "ID is invalid !";
                return response;
            }
            var entityForDeletion = await _dbContext.TblInsuranceSetups.FindAsync(id);
            if (entityForDeletion == null)
            {
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.Error = $"Record is not exist against ID : {id} in our system !";
                return response;
            }
            entityForDeletion.DeletedBy = LoggedInUser;
            entityForDeletion.DeletedDate = DateTimeNow.Get;
            entityForDeletion.IsDeleted = true;
            _dbContext.TblInsuranceSetups.Update(entityForDeletion);
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success";
                response.Message = "Request Processed !";
            }
            return response;
        }
        public async Task<RequestResponse<List<GetInsuranceTypeLookupDto>>> GetInsuranceTypeLookup()
        {
            var response = new RequestResponse<List<GetInsuranceTypeLookupDto>>();
            var lookupResult = await _dbContext.TblInsuranceSetups.Where(f=> f.IsDeleted.Equals(false)).Select(s => new GetInsuranceTypeLookupDto()
            {
                 InsuranceId = s.InsuranceId,
                 InsuranceName = s.InsuranceName,
                 InsuranceType = s.InsuranceType

            }).OrderBy(o => o.InsuranceName).ToListAsync();
            response.HttpStatusCode = Status.Success;
            response.Status = "Success";
            response.Message = "Request Processed !";
            response.Data = lookupResult;
            return response;
        }
        public async Task<DataQueryResponse<List<GetInsuranceTypeDetailBasedOnSearchDto>>> GetInsuranceTypeDetailAsync(DataQueryModel<InsuranceSetupQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetInsuranceTypeDetailBasedOnSearchDto>>();
            var result = await _dbContext.TblInsuranceSetups.Where(f => f.IsDeleted == false).Select(s => new GetInsuranceTypeDetailBasedOnSearchDto() 
            {
                 InsuranceId = s.InsuranceId,
                 InsuranceName = s.InsuranceName,
                 InsuranceType = s.InsuranceType,
                 InsuranceStatus = s.InsuranceStatus

            }).OrderByDescending(O => O.InsuranceId).ToListAsync();
            if (query.QueryModel?.InsuranceId > 0)
            {
                result = result.Where(f => f.InsuranceId.Equals(query.QueryModel.InsuranceId)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.InsuranceType))
            {
                result = result.Where(f => f.InsuranceType !=null && f.InsuranceType.ToLower().Contains(query.QueryModel.InsuranceType.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.InsuranceName))
            {
                result = result.Where(f => f.InsuranceName != null && f.InsuranceName.ToLower().Contains(query.QueryModel.InsuranceName.ToLower())).ToList();
            }
            if (query.QueryModel?.Status !=null)
            {
                result = result.Where(f => f.InsuranceStatus.Equals(query.QueryModel.Status)).ToList();
            }
            response.Total = result.Count;
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                result = result.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            response.Data = result;
            return response;
        }
        public bool IsInsuranceNameUnique(string name)
        {
            var isUnique = false;
            if (!string.IsNullOrEmpty(name))
            {
                var chk = _dbContext.TblInsuranceSetups.Any(n => n.InsuranceName.Trim().ToLower() == name.Trim().ToLower());
                isUnique = chk == true ? false : true;
            }
            return isUnique;
        }

     
    }
}
