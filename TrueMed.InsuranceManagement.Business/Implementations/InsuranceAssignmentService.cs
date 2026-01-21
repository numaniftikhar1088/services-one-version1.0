using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.InsuranceManagement.Business.Interface;
using TrueMed.InsuranceManagement.Domain.Dtos;
using TrueMed.InsuranceManagement.Domain.QueryModel;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Validator.InsuranceManagement;
using Status = TrueMed.Domain.Model.Identity.Status;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;

namespace TrueMed.InsuranceManagement.Business.Implementations
{
    public class InsuranceAssignmentService : IInsuranceAssignmentService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ApplicationDbContext _dbContext;
        private MasterDbContext _masterDbContext;
        public InsuranceAssignmentService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _masterDbContext = masterDbContext;
            _utilityService = utilityService;
            _httpContextAccessor = httpContextAccessor;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse> SaveInsuranceAssignmentAsync(SaveInsuranceAssignmentDto insuranceAssignmentDto)
        {
            var response = new RequestResponse();
            InsuranceAssignmentValidator validation = new InsuranceAssignmentValidator();
            var validate = await validation.ValidateAsync(insuranceAssignmentDto);
            if (validate.Errors.Any())
            {
                response.Error = validate.Errors.Select(e => e.ErrorMessage);
                response.Status = "Validation Failed !";
                response.HttpStatusCode = Status.Failed;
                response.Message = "Request failed !";
                return response;
            }
            var entity = _utilityService.Converstion<SaveInsuranceAssignmentDto, TblInsuranceAssignment>(insuranceAssignmentDto);
            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            if (entity.InsuranceAssignmentId > 0)
            {
                var isRecordExist = await _dbContext.TblInsuranceAssignments.FindAsync(entity.InsuranceAssignmentId);
                if (isRecordExist !=null)
                {
                    var createdBy = isRecordExist.CreatedBy;
                    var createdDate = isRecordExist.CreatedDate;
                    entity.CreatedDate = createdDate;
                    entity.CreatedBy = createdBy;
                    entity.UpdatedBy = LoggedInUser;
                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.OptionId = insuranceAssignmentDto.OptionId;
                    _dbContext.TblInsuranceAssignments.Update(entity);
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
                if (!GetInsuranceAssignmentOnProviderAndInsurance(insuranceAssignmentDto))
                {
                    entity.CreatedBy = LoggedInUser;
                    entity.CreatedDate = DateTimeNow.Get;
                    entity.OptionId = insuranceAssignmentDto.OptionId;
                    await _dbContext.TblInsuranceAssignments.AddAsync(entity);
                    response.Message = "Record is Added !";

                }
                else
                {
                    response.Status = "Duplicate Record Exists";
                    response.HttpStatusCode = Status.AlreadyExists;
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
        public async Task<RequestResponse> ChangeInsuranceAssignmentStatusAsync(ChangeInsuranceAssignmentStatusDto statusChangeDto)
        {
            var response = new RequestResponse();
            ChangeInsuranceAssignmentStatusValidator validation = new ChangeInsuranceAssignmentStatusValidator();
            var validate = await validation.ValidateAsync(statusChangeDto);
            if (validate.Errors.Any())
            {
                response.Error = validate.Errors.Select(e => e.ErrorMessage);
                response.Status = "Validation Failed !";
                response.HttpStatusCode = Status.Failed;
                response.Message = "Request failed !";
                return response;
            }
            var recordForStatusChange = await _dbContext.TblInsuranceAssignments.FindAsync(statusChangeDto.InsuranceAssignmentId);
            if (recordForStatusChange != null)
            {
                recordForStatusChange.UpdatedDate = DateTimeNow.Get;
                recordForStatusChange.UpdatedBy = LoggedInUser;
                recordForStatusChange.Status = statusChangeDto.NewStatus;
                _dbContext.TblInsuranceAssignments.Update(recordForStatusChange);
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
        public async Task<DataQueryResponse<IQueryable>> GetInsuranceAssignmentAsync(DataQueryModel<InsuranceAssignmentQueryModel> dataQueryModel)
        {
            var response = new DataQueryResponse<IQueryable>();
            bool isFiltered = false;
            if (

                 !string.IsNullOrEmpty(dataQueryModel.QueryModel.ProviderName?.Trim().ToLower())
                 || !string.IsNullOrEmpty(dataQueryModel.QueryModel.DisplayName?.Trim().ToLower())
                 || !string.IsNullOrEmpty(dataQueryModel.QueryModel.InsuranceName?.Trim().ToLower())
                 || !string.IsNullOrEmpty(dataQueryModel.QueryModel.InsuranceType?.Trim().ToLower())
                 || !string.IsNullOrEmpty(dataQueryModel.QueryModel.ProviderCode?.Trim().ToLower())
                 || dataQueryModel.QueryModel.ProviderStatus != null

               )
            {
                response.Data = _dbContext.TblInsuranceAssignments.Where(c => c.ProviderId.Equals(dataQueryModel.QueryModel.ProviderName)
                || c.ProviderDisplayName.Equals(dataQueryModel.QueryModel.DisplayName)
                || c.InsuranceId.Equals(dataQueryModel.QueryModel.InsuranceName)
                || c.InsuranceType.Equals(dataQueryModel.QueryModel.InsuranceType)
                || c.ProviderCode.Equals(dataQueryModel.QueryModel.ProviderCode)
                || c.Status.Equals(dataQueryModel.QueryModel.ProviderStatus));
                isFiltered = true;

            }
            if (dataQueryModel.PageNumber > 0 && dataQueryModel.PageSize > 0)
            {
                response.Data = _dbContext.TblInsuranceAssignments.Skip((dataQueryModel.PageNumber - 1) * dataQueryModel.PageSize).Take(dataQueryModel.PageSize).AsQueryable();
                isFiltered = true;
            }
            if (!isFiltered)
            {
                response.Data = _dbContext.TblInsuranceAssignments.AsQueryable();
            }
            //response.Total = response.Data.Count();
            return response;
        }
        public async Task<RequestResponse> DeleteInsuranceAssignmentByIdAsync(int id)
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
            var entityForDeletion = await _dbContext.TblInsuranceAssignments.FindAsync(id);
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
            _dbContext.TblInsuranceAssignments.Update(entityForDeletion);
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success";
                response.Message = "Request Processed !";
            }
            return response;
        }
        public async Task<RequestResponse<GetInsuranceAssignmentDetailsByIdDto>> GetInsuranceAssignmentByIdAsync(int id)
        {
            var response = new RequestResponse<GetInsuranceAssignmentDetailsByIdDto>();
            if (id <= 0)
            {
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.Error = "ID is invalid !";
                return response;
            }
            var resultData = await _dbContext.TblInsuranceAssignments.Select(s => new GetInsuranceAssignmentDetailsByIdDto()
            {
                InsuranceAssignmentId = s.InsuranceAssignmentId,
                InsuranceId = s.InsuranceId,
                InsuranceType = s.InsuranceType,
                ProviderCode = s.ProviderCode,
                ProviderDisplayName = s.ProviderDisplayName,
                ProviderId = s.ProviderId,
                Status = s.Status

            }).FirstOrDefaultAsync(f => f.InsuranceAssignmentId.Equals(id));
            if (resultData == null)
            {
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.Error = $"Record is not exist against ID : {id} in our system !"; 
                return response;
            }
            response.Data = resultData;
            response.HttpStatusCode = Status.Success;
            response.Status = "Success";
            response.Message = "Request Processed !";
            return response;
        }
        public async Task<DataQueryResponse<List<GetInsuranceAssignmentDetailsDto>>> GetInsuranceAssignmentDetailBasedOnSearchAsync(DataQueryModel<GetInsuranceAssignmentDetailsQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetInsuranceAssignmentDetailsDto>>();

            #region DataSource
            var insuranceAssignmentInfo = await _dbContext.TblInsuranceAssignments.Where(f => f.IsDeleted == false).Select(s =>
           new
           {
               ProviderId = s.ProviderId,
               InsuranceId = s.InsuranceId,
               InsuranceAssignmentId = s.InsuranceAssignmentId,
               ProviderDisplayName = s.ProviderDisplayName,
               ProviderCode = s.ProviderCode,
               Status = s.Status,
               OptionId = s.OptionId

           }).ToListAsync();

            var ProviderInfo = await _masterDbContext.TblInsuranceProviders.Where(f => f.IsDeleted == false).Select(s =>
            new
            {
                InsuranceProviderId = s.InsuranceProviderId,
                ProviderName = s.ProviderName

            }).ToListAsync();
            var insuranceTypeInfo = await _masterDbContext.TblInsuranceSetups.Where(f => f.IsDeleted == false).Select(s =>
            new
            {
                InsuranceId = s.InsuranceId,
                InsuranceName = s.InsuranceName,
                InsuranceType = s.InsuranceType

            }).ToListAsync();
            var optionsInfo = await _masterDbContext.TblControlOptions.Select(s =>
           new
           {
               OptionId = s.OptionId,
               OptionName = s.OptionName,
               OptionValue = s.OptionValue

           }).ToListAsync();
            #endregion

            var result = (from insuranceAssignment in insuranceAssignmentInfo
                          join Provider in ProviderInfo on insuranceAssignment.ProviderId equals Provider.InsuranceProviderId
                          into insuranceAssignmentProvider from insuranceAssignmentPlusProvider in insuranceAssignmentProvider.DefaultIfEmpty()
                          join Insurance in insuranceTypeInfo on insuranceAssignment.InsuranceId equals Insurance.InsuranceId
                          into insuranceAssignmentInsurance from insuranceAssignmentPlusInsurance in insuranceAssignmentInsurance.DefaultIfEmpty()
                          join options in optionsInfo on insuranceAssignment.OptionId equals options.OptionId
                          into insuranceAssignmentoptions from insuranceAssignmentPlusoptions in insuranceAssignmentoptions.DefaultIfEmpty()
                          select new GetInsuranceAssignmentDetailsDto()
                          {
                              InsuranceId = insuranceAssignment.InsuranceId,
                              InsuranceAssignmentId = insuranceAssignment.InsuranceAssignmentId,
                              ProviderID = insuranceAssignmentPlusProvider == null ? 0 : insuranceAssignmentPlusProvider.InsuranceProviderId,
                              ProviderName = insuranceAssignmentPlusProvider == null ? "NA" : insuranceAssignmentPlusProvider.ProviderName,
                              DisplayName = insuranceAssignment.ProviderDisplayName,
                              TMITCode = insuranceAssignment.ProviderCode,
                              InsuranceName = insuranceAssignmentPlusInsurance == null ? "NA" : insuranceAssignmentPlusInsurance.InsuranceName,
                              InsuranceType = insuranceAssignmentPlusInsurance == null ? "NA" : insuranceAssignmentPlusInsurance.InsuranceType,
                              Status = insuranceAssignment.Status,
                              OptionId = insuranceAssignmentPlusoptions == null ? 0 : insuranceAssignmentPlusoptions.OptionId,
                              OptionName = insuranceAssignmentPlusoptions == null ? "" : insuranceAssignmentPlusoptions.OptionName,
                              OptionValue = insuranceAssignmentPlusoptions == null ? "" : insuranceAssignmentPlusoptions.OptionValue

                          }).DistinctBy(d => d.InsuranceAssignmentId).OrderByDescending(o => o.InsuranceAssignmentId).ToList();
            
            #region Filter
            if (query.QueryModel?.ProviderID > 0)
            {
                result = result.Where(f => f.ProviderID.Equals(query.QueryModel.ProviderID)).ToList();
            }
            if (query.QueryModel?.OptionId > 0)
            {
                result = result.Where(f => f.OptionId.Equals(query.QueryModel.OptionId)).ToList();
            }
            if (query.QueryModel?.InsuranceAssignmentId > 0)
            {
                result = result.Where(f => f.InsuranceAssignmentId.Equals(query.QueryModel.InsuranceAssignmentId)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.OptionName))
            {
                result = result.Where(f => f.OptionName != null && f.OptionName.ToLower().Contains(query.QueryModel.OptionName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.OptionValue))
            {
                result = result.Where(f => f.OptionValue != null && f.OptionValue.ToLower().Contains(query.QueryModel.OptionValue.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ProviderName))
            {
                result = result.Where(f => f.ProviderName !=null && f.ProviderName.ToLower().Contains(query.QueryModel.ProviderName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.DisplayName))
            {
                result = result.Where(f => f.DisplayName !=null && f.DisplayName.ToLower().Contains(query.QueryModel.DisplayName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TMITCode))
            {
                result = result.Where(f => f.TMITCode != null && f.TMITCode.ToLower().Contains(query.QueryModel.TMITCode.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.InsuranceName))
            {
                result = result.Where(f => f.InsuranceName != null && f.InsuranceName.ToLower().Contains(query.QueryModel.InsuranceName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.InsuranceType))
            {
                result = result.Where(f => f.InsuranceType != null && f.InsuranceType.ToLower().Contains(query.QueryModel.InsuranceType.ToLower())).ToList();
            }
            if (query.QueryModel?.Status != null)
            {
                result = result.Where(f => f.Status.Equals(query.QueryModel.Status)).ToList();
            }


            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                result = result.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();
            }
            else
            {
                result = result.AsQueryable().OrderBy($"insuranceId desc").ToList();
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

        private bool GetInsuranceAssignmentOnProviderAndInsurance(SaveInsuranceAssignmentDto req)
        {
            var existing = _dbContext.TblInsuranceAssignments.FirstOrDefault(f => f.InsuranceId == req.InsuranceId && f.ProviderId == req.ProviderId && f.ProviderCode == req.ProviderCode);
            if(existing != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
