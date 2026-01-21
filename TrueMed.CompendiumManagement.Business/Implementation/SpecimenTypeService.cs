using FluentValidation;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
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
    public class SpecimenTypeService : ISpecimenTypeService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ApplicationDbContext _dbContext;
        public SpecimenTypeService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor)
        {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _utilityService = utilityService;
            _httpContextAccessor = httpContextAccessor;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse> SaveSpecimenTypeAsync(SaveSpecimenTypeRequest request)
        {
            var response = new RequestResponse();

            var validation = new SpecimenTypeValidator();
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
            var entity = _utilityService.Converstion<SaveSpecimenTypeRequest, TblSpecimenType>(request);

            if (entity.SpecimenTypeId > 0)
            {
                var getRecordForEdit = await _dbContext.TblSpecimenTypes.FindAsync(entity.SpecimenTypeId);
                if (getRecordForEdit != null)
                {
                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;

                    _dbContext.TblSpecimenTypes.Update(entity);
                    response.Message = "Record is Updated...";

                }
                else
                {
                    response.Error = $"Record is not exist against ID : {entity.SpecimenTypeId} in our system...";
                    response.HttpStatusCode = Status.Failed;
                    response.Status = "Failed !";
                    response.Message = "Request Failed !";
                    return response;
                }
            }
            else
            {
                if (!(await IsSpecimenPreFixExistsAsync(request.SpecimenPreFix)))
                {
                    entity.CreatedBy = LoggedInUser;
                    entity.CreatedDate = DateTimeNow.Get;

                    entity.IsDeleted = false;

                    if (entity.SpecimenStatus == null)
                        entity.SpecimenStatus = true;

                    await _dbContext.TblSpecimenTypes.AddAsync(entity);
                    response.Message = "Record is Added...";
                }
                else
                {
                    response.HttpStatusCode = Status.AlreadyExists;
                    response.Status = "Record Already Exists !";
                    return response;
                }
                
            }

            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }
        public async Task<DataQueryResponse<List<GetSpecimenTypeDetailResponse>>> GetSpecimenTypeDetailAsync(DataQueryModel<SpecimenTypeQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetSpecimenTypeDetailResponse>>();

            var dataSource = await _dbContext.TblSpecimenTypes.Where(f => f.IsDeleted == false || f.IsDeleted == null)
                .Select(s => new GetSpecimenTypeDetailResponse() 
                {
                     SpecimenTypeId = s.SpecimenTypeId,
                     SpecimenType = s.SpecimenType,
                     SpecimenPreFix= s.SpecimenPreFix.TrimEnd(),
                     SpecimenStatus = s.SpecimenStatus

                }).OrderByDescending(o => o.SpecimenTypeId).ToListAsync();
            
            #region Filtered
            if (query.QueryModel?.SpecimenTypeId > 0)
            {
                dataSource = dataSource.Where(f => f.SpecimenTypeId == query.QueryModel.SpecimenTypeId).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.SpecimenType))
            {
                dataSource = dataSource.Where(f => f.SpecimenType !=null && f.SpecimenType.ToLower().Contains(query.QueryModel.SpecimenType.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.SpecimenPreFix))
            {
                dataSource = dataSource.Where(f => f.SpecimenPreFix != null && f.SpecimenPreFix.ToLower().Contains(query.QueryModel.SpecimenPreFix.ToLower())).ToList();
            }
            if (query.QueryModel?.SpecimenStatus != null)
            {
                dataSource = dataSource.Where(f => f.SpecimenStatus.Equals(query.QueryModel.SpecimenStatus)).ToList();
            }


            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();

            }
            else
            {
                dataSource = dataSource.AsQueryable().OrderBy($"specimenTypeId desc").ToList();
            }
            response.TotalRecord = dataSource.Count;

            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }

            #endregion
            response.FilteredRecord = dataSource.Count;
            response.Result = dataSource;
            return response;
        }

        public async Task<bool> IsSpecimenPreFixExistsAsync(string prefix)
        {
            return await _dbContext.TblSpecimenTypes.AnyAsync(x => x.SpecimenPreFix.Trim().ToLower() == prefix.Trim().ToLower());
        }
        public async Task<bool> IsSpecimenTypeExistsAsync(string specimenType)
        {
            return await _dbContext.TblSpecimenTypes.AnyAsync(x => x.SpecimenType.Trim().ToLower() == specimenType.Trim().ToLower());
        }
        public async Task<RequestResponse> DeleteSpecimenTypeByIdAsync(int id)
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
            var getRecordForSoftDelete = await _dbContext.TblSpecimenTypes.FindAsync(id);
            if (getRecordForSoftDelete != null)
            {
                getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
                getRecordForSoftDelete.DeletedBy = LoggedInUser;

                getRecordForSoftDelete.IsDeleted = true;

                _dbContext.TblSpecimenTypes.Update(getRecordForSoftDelete);
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
        public async Task<RequestResponse> ChangeSpecimenTypeStatusAsync(ChangeSpecimenTypeStatusRequest request)
        {
            var response = new RequestResponse();

            var validation = new ChangeSpecimenTypeStatusValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
                response.HttpStatusCode = Status.Failed;
                response.Status = "Validation Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var getRecordForStatusChanged = await _dbContext.TblSpecimenTypes.FindAsync(request.SpecimenTypeId);
            if (getRecordForStatusChanged != null)
            {
                getRecordForStatusChanged.UpdatedBy = LoggedInUser;
                getRecordForStatusChanged.UpdatedDate = DateTimeNow.Get;

                getRecordForStatusChanged.SpecimenStatus = request.SpecimenStatus;
                _dbContext.Update(getRecordForStatusChanged);
                response.Message = "Status Changed...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {request.SpecimenTypeId} in our system...";
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
        public async Task<RequestResponse<List<SpecimenTypeLookup>>> SpecimenTypeLookupAsync()
        {
            var response = new RequestResponse<List<SpecimenTypeLookup>>();

            var dataSource = await _dbContext.TblSpecimenTypes.Where(f => f.IsDeleted == false && f.SpecimenStatus == true)
                .Select(s => new SpecimenTypeLookup()
                {
                    SpecimenTypeId = s.SpecimenTypeId,
                    SpecimenType = s.SpecimenType,

                }).ToListAsync();

            response.Data = dataSource;
            response.HttpStatusCode = Status.Success;
            response.Status = "Success";
            response.Message = "Request Processed...";

            return response;
        }
    }
}
