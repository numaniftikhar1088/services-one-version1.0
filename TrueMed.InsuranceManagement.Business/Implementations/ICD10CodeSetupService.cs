using FluentValidation;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Common;
using TrueMed.InsuranceManagement.Business.Interface;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;
using TrueMed.Sevices.MasterEntities;
using TrueMed.Validator.InsuranceManagement;

namespace TrueMed.InsuranceManagement.Business.Implementations
{
    public class ICD10CodeSetupService : IICD10CodeSetupService
    {
        private readonly IUtilityService _utilityService;
        private readonly IConnectionManager _connectionManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private MasterDbContext _dbContext;
        private readonly ILookupManager _lookupManager;
        public ICD10CodeSetupService(IUtilityService utilityService, IConnectionManager connectionManager, IHttpContextAccessor httpContextAccessor, MasterDbContext dbContext, ILookupManager lookupManager)
        {
            _utilityService = utilityService;
            _connectionManager = connectionManager;
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
            _lookupManager = lookupManager;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }

        public async Task<DataQueryResponse<List<GetICD10CodeDetailInfoDto>>> GetICD10CodeDetailInfoAsync(DataQueryModel<ICD10CodeSetupQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetICD10CodeDetailInfoDto>>();
            var dataSource = await _dbContext.TblIcd10codes.Where(f => f.IsDeleted.Equals(false)).Select(s => new GetICD10CodeDetailInfoDto()
            {
                Description = s.Description,
                Icd10code = s.Icd10code,
                Icd10id = s.Icd10id,
                Icd10status = s.Icd10status

            }).OrderByDescending(o => o.Icd10id).ToListAsync();
            #region Filter
            if (!string.IsNullOrEmpty(query.QueryModel.ICD10Code))
            {
                dataSource = dataSource.Where(f => f.Icd10code != null && f.Icd10code.ToLower().Contains(query.QueryModel.ICD10Code.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel.Description))
            {
                dataSource = dataSource.Where(f => f.Description != null && f.Description.ToLower().Contains(query.QueryModel.Description.ToLower())).ToList();
            }
            if (query.QueryModel.Icd10status != null)
            {
                dataSource = dataSource.Where(f => f.Icd10status.Equals(query.QueryModel.Icd10status)).ToList();
            }


            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();

            }
            else
            {
                dataSource = dataSource.AsQueryable().OrderBy($"icd10id desc").ToList();
            }


            response.Total = dataSource.Count();


            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion

            response.Data = dataSource.OrderByDescending(d => d.Icd10id).ToList();
            return response;
        }
        public async Task<DataQueryResponse<List<GetICD10CodeSetupBriefInfoDto>>> GetICD10CodeSetupBriefInfoAsync()
        {
            var response = new DataQueryResponse<List<GetICD10CodeSetupBriefInfoDto>>();
            var dataSource = await _dbContext.TblIcd10codes.Select(s => new GetICD10CodeSetupBriefInfoDto()
            {
                Description = s.Description,
                Icd10code = s.Icd10code,
                Icd10id = s.Icd10id,
                Icd10status = s.Icd10status

            }).ToListAsync();
            response.Total = dataSource.Count();
            response.Data = dataSource;
            return response;
        }
        public async Task<RequestResponse<GetICD10CodeDetailInfoDto>> GetICD10CodeDetailInfoByIdAsync(int id)
        {
            var response = new RequestResponse<GetICD10CodeDetailInfoDto>();

            if (id <= 0)
            {
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.Error = "ID is invalid !";
                return response;
            }
            var result = await _dbContext.TblIcd10codes.FindAsync(id);
            response.Data = _utilityService.Converstion<TblIcd10code, GetICD10CodeDetailInfoDto>(result);
            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            return response;
        }
        public async Task<RequestResponse<GetICD10CodeSetupBriefInfoDto>> GetICD10CodeSetupBriefInfoByIdAsync(int id)
        {
            var response = new RequestResponse<GetICD10CodeSetupBriefInfoDto>();

            if (id <= 0)
            {
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.Error = "ID is invalid !";
                return response;
            }
            var result = await _dbContext.TblIcd10codes.FindAsync(id);
            response.Data = _utilityService.Converstion<TblIcd10code, GetICD10CodeSetupBriefInfoDto>(result);
            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            return response;
        }
        public async Task<RequestResponse> SaveICD10CodeSetupAsync(SaveICD10CodeSetupDto entity)
        {
            var response = new RequestResponse();
            var validator = new SaveICD10CodeSetupValidator();
            var validate = await validator.ValidateAsync(entity);
            if (validate.Errors.Any())
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage);
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;
            }
            var convertedEntity = _utilityService.Converstion<SaveICD10CodeSetupDto, TblIcd10code>(entity);
            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            if (convertedEntity.Icd10id > 0)
            {
                var entityForEdit = await _dbContext.TblIcd10codes.FindAsync(convertedEntity.Icd10id);
                if (entityForEdit != null)
                {
                    var createdBy = entityForEdit.CreatedBy;
                    var createdDate = entityForEdit.CreatedDate;
                    convertedEntity.UpdatedBy = LoggedInUser;
                    convertedEntity.UpdatedDate = DateTimeNow.Get;
                    entityForEdit = convertedEntity;
                    entityForEdit.CreatedDate = createdDate;
                    entityForEdit.CreatedBy = createdBy;
                    _dbContext.TblIcd10codes.Update(entityForEdit);
                    response.Message = "Record is updated !";
                }
                else
                {
                    response.Message = "Request Failed !";
                    response.Status = "Failed !";
                    response.HttpStatusCode = Status.Failed;
                    response.Error = $"Record is not exist against ID : {convertedEntity.Icd10id} in our system !";
                    return response;
                }
            }
            else
            {
                convertedEntity.CreatedBy = LoggedInUser;
                convertedEntity.CreatedDate = DateTimeNow.Get;
                await _dbContext.AddAsync(convertedEntity);
                response.Message = "Record is Added !";
            }
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success";
            }
            return response;
        }
        public async Task<RequestResponse> StatusChangedICD10CodeSetupAsync(StatusChangedICD10CodeSetupDto entity)
        {
            var response = new RequestResponse();
            var validator = new StatusChangedICD10CodeSetupValidator();
            var validate = await validator.ValidateAsync(entity);
            if (validate.Errors.Any())
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage);
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;
            }
            var entityForEdit = await _dbContext.TblIcd10codes.FindAsync(entity.ICD10CodeID);
            if (entityForEdit != null)
            {
                entityForEdit.UpdatedBy = LoggedInUser;
                entityForEdit.UpdatedDate = DateTimeNow.Get;
                entityForEdit.Icd10status = entity.NewStatus;
                _dbContext.TblIcd10codes.Update(entityForEdit);
                response.Message = "Status Changed !";
            }
            else
            {
                response.Message = "Request Failed !";
                response.Status = "Failed !";
                response.HttpStatusCode = Status.Failed;
                response.Error = $"Record is not exist against ID : {entity.ICD10CodeID} in our system !";
            }
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.Status = "Success";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }
        public async Task<RequestResponse> DeleteICD10CodeSetupByIdAsync(int id)
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
            var entityForDeletion = await _dbContext.TblIcd10codes.FindAsync(id);
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
            _dbContext.TblIcd10codes.Update(entityForDeletion);
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success";
                response.Message = "Request Processed !";
            }
            return response;
        }

        public async Task<List<ICD10CodeModel>> ICD10CodesSearch(string query, int Key)
        {
            return await _lookupManager.ICD10CodeSearch(query, Key);
        }

    }
}
