using Azure;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.InsuranceManagement.Business.Interface;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;
using TrueMed.Sevices.MasterEntities;
using TrueMed.Validator.InsuranceManagement;
using TrueMed.Business.MasterDBContext;

namespace TrueMed.InsuranceManagement.Business.Implementations
{
    public class InsuranceProviderService : IInsuranceProviderService
    {
        private readonly IUtilityService _utilityService;
        private readonly IConnectionManager _connectionManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private MasterDbContext _dbContext;

        public InsuranceProviderService(IUtilityService utilityService, IConnectionManager connectionManager, IHttpContextAccessor httpContextAccessor, MasterDbContext dbContext)
        {
            _utilityService = utilityService;
            _connectionManager = connectionManager;
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }

        public async Task<RequestResponse> SaveInsuranceProviderAsync(SaveInsuranceProviderDto saveInsuranceProviderDto)
        {
            var response = new RequestResponse();
            SaveInsuranceProviderValidator validator = new SaveInsuranceProviderValidator();
            var validate = await validator.ValidateAsync(saveInsuranceProviderDto);
            if (validate.Errors.Any())
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage);
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;
            }
            var entity = _utilityService.Converstion<SaveInsuranceProviderDto, TblInsuranceProvider>(saveInsuranceProviderDto);
            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            if (entity.InsuranceProviderId > 0)
            {
                var recordBeforeEdit = await _dbContext.TblInsuranceProviders.FirstOrDefaultAsync(r => r.InsuranceProviderId.Equals(entity.InsuranceProviderId));
                if (recordBeforeEdit != null)
                {
                    if (!entity.ProviderName.Equals(recordBeforeEdit.ProviderName))
                    {
                        if (!IsProviderNameUnique(entity.ProviderName))
                        {
                            response.Message = "Request Failed !";
                            response.Status = "Failed !";
                            response.HttpStatusCode = Status.Failed;
                            response.Error = $"Provider Name : {entity.ProviderName} is exist in our system please use another Provider Name !";
                            return response;
                        }
                    }
                    entity.UpdatedBy = LoggedInUser;
                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.CreatedBy = recordBeforeEdit.CreatedBy;
                    entity.CreatedDate = recordBeforeEdit.CreatedDate;
                    recordBeforeEdit = entity;
                    _dbContext.TblInsuranceProviders.Update(recordBeforeEdit);
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
                if (IsProviderNameUnique(entity.ProviderName))
                {
                    await _dbContext.TblInsuranceProviders.AddAsync(entity);
                    response.Message = "Record is Added !";
                }
                else
                {
                    response.Message = "Request Failed !";
                    response.Status = "Failed !";
                    response.HttpStatusCode = Status.Failed;
                    response.Error = $"Provider Name : {entity.ProviderName} is exist in our system please use another Provider Name !";
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
        public async Task<RequestResponse> ChangeInsuranceProviderStatusAsync(InsuranceProviderChangeStatusDto statusChangeDto)
        {
            var response = new RequestResponse();
            InsuranceProviderChangeStatusValidator validation = new InsuranceProviderChangeStatusValidator();
            var validate = await validation.ValidateAsync(statusChangeDto);
            if (validate.Errors.Any())
            {
                response.Error = validate.Errors.Select(e => e.ErrorMessage);
                response.Status = "Validation Failed !";
                response.HttpStatusCode = Status.Failed;
                response.Message = "Request failed !";
                return response;
            }
            var recordForStatusChange = await _dbContext.TblInsuranceProviders.FindAsync(statusChangeDto.InsuranceProviderId);
            if (recordForStatusChange != null)
            {
                recordForStatusChange.UpdatedBy = LoggedInUser;
                recordForStatusChange.UpdatedDate = DateTimeNow.Get;
                recordForStatusChange.ProviderStatus = statusChangeDto.NewStatus;
                _dbContext.TblInsuranceProviders.Update(recordForStatusChange);
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
        //public async Task<DataQueryResponse<IQueryable>> GetInsuranceProviderAsync(DataQueryModel<InsuranceProviderQueryModel> dataQueryModel)
        //{
        //    var response = new DataQueryResponse<IQueryable>();
        //    bool isFiltered = false;
        //    if (

        //         !string.IsNullOrEmpty(dataQueryModel.QueryModel.ProviderName)
        //         || !string.IsNullOrEmpty(dataQueryModel.QueryModel.ProviderCode)
        //         || !string.IsNullOrEmpty(dataQueryModel.QueryModel.City)
        //         || !string.IsNullOrEmpty(dataQueryModel.QueryModel.State)
        //         || !string.IsNullOrEmpty(dataQueryModel.QueryModel.ZipCode)
        //         || !string.IsNullOrEmpty(dataQueryModel.QueryModel.Phone)
        //         || dataQueryModel.QueryModel.Status != null

        //       )
        //    {
        //        response.Data = _dbContext.TblInsuranceProviders.Where(c => c.ProviderName.Trim().ToLower().Equals(dataQueryModel.QueryModel.ProviderName.Trim().ToLower())
        //        || c.ProviderCode.Trim().ToLower().Equals(dataQueryModel.QueryModel.ProviderCode.Trim().ToLower())
        //        || c.City == dataQueryModel.QueryModel.City
        //        || c.State == dataQueryModel.QueryModel.State
        //        || c.ZipCode.Equals(dataQueryModel.QueryModel.ZipCode)
        //        || c.LandPhone.Equals(dataQueryModel.QueryModel.Phone)
        //        || dataQueryModel.QueryModel.Status != null);
        //        isFiltered = true;

        //    }
        //    if (dataQueryModel.PageNumber > 0 && dataQueryModel.PageSize > 0)
        //    {
        //        response.Data = _dbContext.TblInsuranceProviders.Skip((dataQueryModel.PageNumber - 1) * dataQueryModel.PageSize).Take(dataQueryModel.PageSize).AsQueryable();
        //        isFiltered = true;
        //    }
        //    if (!isFiltered)
        //    {
        //        response.Data = _dbContext.TblInsuranceProviders.AsQueryable();
        //    }
        //    response.Total = response.Data.Count();
        //    return response;
        //}
        public async Task<RequestResponse<GetInsuranceProviderDetailByidDto>> GetInsuranceProviderByIdAsync(int id)
        {
            var response = new RequestResponse<GetInsuranceProviderDetailByidDto>();
            if (id <= 0)
            {
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.Error = "ID is invalid !";
                return response;
            }
            var resultData = await _dbContext.TblInsuranceProviders.Select(s => new GetInsuranceProviderDetailByidDto()
            {
                 InsuranceProviderId= s.InsuranceProviderId,
                 Address1 = s.Address1,
                 Address2 = s.Address2,
                 City = s.City,
                 LandPhone = s.LandPhone,
                 ProviderCode = s.ProviderCode,
                 ProviderName = s.ProviderName,
                 ProviderStatus = s.ProviderStatus,
                 State = s.State,
                 ZipCode = s.ZipCode

            }).FirstOrDefaultAsync(f => f.InsuranceProviderId.Equals(id));
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
        public async Task<RequestResponse> DeleteInsuranceProviderByIdAsync(int id)
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
            var entityForDeletion = await _dbContext.TblInsuranceProviders.FindAsync(id);
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
            _dbContext.TblInsuranceProviders.Update(entityForDeletion);
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success";
                response.Message = "Request Processed !";
            }
            return response;
        }
        public async Task<RequestResponse<List<InuranceProviderLookupDto>>> GetProviderLookupAsync()
        {
            var response = new RequestResponse<List<InuranceProviderLookupDto>>();
            var lookupResult = await _dbContext.TblInsuranceProviders.Where(f => f.IsDeleted.Equals(false)).Select(s => new InuranceProviderLookupDto()
            {
                 InuranceProviderId = s.InsuranceProviderId,
                 ProviderName = s.ProviderName,
                 ProviderCode = s.ProviderCode

            }).OrderBy(o => o.ProviderName).ToListAsync();
            response.HttpStatusCode = Status.Success;
            response.Status = "Success";
            response.Message = "Request Processed !";
            response.Data = lookupResult;
            return response;
        }
        public async Task<RequestResponse<string>> GetProviderCodeAgainstProviderIdAsync(int providerId)
        {
            var response = new RequestResponse<string?>();
            if (providerId == 0)
            {
                response.Error = "Invalid ProviderId !";
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;
            }
            var result = await _dbContext.TblInsuranceProviders.Where(f => f.InsuranceProviderId.Equals(providerId)).Select(s => s.ProviderCode).FirstOrDefaultAsync();
            response.Data = result;
            response.Status = "Success";
            response.Message = "Request Processed !";
            response.HttpStatusCode = Status.Success;
            return response;
        }
        public async Task<DataQueryResponse<List<GetInsuranceProviderDetailDto>>> GetInsuranceProviderDetailAsync(DataQueryModel<InsuranceProviderQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetInsuranceProviderDetailDto>>();
            var result = await _dbContext.TblInsuranceProviders.Where(f => f.IsDeleted == false).Select(s => new GetInsuranceProviderDetailDto()
            {
                 City= s.City,
                 InsuranceProviderId = s.InsuranceProviderId,
                 LandPhone = s.LandPhone,
                 ProviderCode = s.ProviderCode,
                 ProviderName = s.ProviderName,
                 State = s.State,
                 ProviderStatus = s.ProviderStatus,
                 ZipCode = s.ZipCode
            }).OrderByDescending(o => o.InsuranceProviderId).ToListAsync();
            response.Total = result.Count;
            #region filter
            if (query.QueryModel?.InsuranceProviderId > 0)
            {
                result = result.Where(f => f.InsuranceProviderId.Equals(query.QueryModel.InsuranceProviderId)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ProviderName))
            {
                result = result.Where(f => f.ProviderName != null && f.ProviderName.ToLower().Contains(query.QueryModel.ProviderName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ProviderCode))
            {
                result = result.Where(f => f.ProviderCode != null && f.ProviderCode.ToLower().Contains(query.QueryModel.ProviderCode.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.City))
            {
                result = result.Where(f => f.City != null && f.City.ToLower().Contains(query.QueryModel.City.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.State))
            {
                result = result.Where(f => f.State != null && f.State.ToLower().Contains(query.QueryModel.State.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ZipCode))
            {
                result = result.Where(f => f.ZipCode != null && f.ZipCode.ToLower().Contains(query.QueryModel.ZipCode.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Phone))
            {
                result = result.Where(f => f.LandPhone != null && f.LandPhone.ToLower().Contains(query.QueryModel.Phone.ToLower())).ToList();
            }
            if (query.QueryModel?.Status !=null)
            {
                result = result.Where(f => f.ProviderStatus.Equals(query.QueryModel.Status)).ToList();
            }
            response.Total = result.Count;
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                result = result.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion
            response.Data = result;
            return response;
        }
        public bool IsProviderNameUnique(string name)
        {
            var isUnique = false;
            if (!string.IsNullOrEmpty(name))
            {
                var chk = _dbContext.TblInsuranceProviders.Any(n => n.ProviderName.Trim().ToLower() == name.Trim().ToLower());
                isUnique = chk == true ? false : true;
            }
            return isUnique;
        }
    }
}
