using Azure.Core;
using FluentValidation;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
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
using Status = TrueMed.Domain.Model.Identity.Status;
using TrueMed.Business.TenantDbContext;
namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class TestTypeService : ITestTypeService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ApplicationDbContext _dbContext;
        public TestTypeService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor)
        {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException(); 
            _utilityService = utilityService;
            _httpContextAccessor = httpContextAccessor;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }

        public async Task<RequestResponse> SaveTestTypeAsync(SaveTestTypeRequest request)
        {
            var response = new RequestResponse();

            var validation = new SaveTestTypeValidator();
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
            var entity = _utilityService.Converstion<SaveTestTypeRequest, TblTestType>(request);

            if (entity.TestTypeId > 0)
            {
                var getRecordForEdit = await _dbContext.TblTestTypes.FindAsync(entity.TestTypeId);
                if (getRecordForEdit != null)
                {
                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;

                    _dbContext.TblTestTypes.Update(entity);
                    response.Message = "Record is Updated...";

                }
                else
                {
                    response.Error = $"Record is not exist against ID : {entity.TestTypeId} in our system...";
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

                if (entity.TestTypeStatus == null)
                    entity.TestTypeStatus = true;

                await _dbContext.AddAsync(entity);
                response.Message = "Record is Added...";
            }

            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }
        public async Task<RequestResponse> ChangeTestTypeStatusAsync(ChangeTestTypeStatusRequest request)
        {
            var response = new RequestResponse();

            var validation = new ChangeTestTypeStatusValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
                response.HttpStatusCode = Status.Failed;
                response.Status = "Validation Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var getRecordForStatusChanged = await _dbContext.TblTestTypes.FindAsync(request.TestTypeId);
            if (getRecordForStatusChanged != null)
            {
                getRecordForStatusChanged.UpdatedBy = LoggedInUser;
                getRecordForStatusChanged.UpdatedDate = DateTimeNow.Get;

                getRecordForStatusChanged.TestTypeStatus = request.TestTypeStatus;
                _dbContext.Update(getRecordForStatusChanged);
                response.Message = "Status Changed...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {request.TestTypeId} in our system...";
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
        public async Task<RequestResponse> DeleteTestTypeByIdAsync(int id)
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
            var getRecordForSoftDelete = await _dbContext.TblTestTypes.FindAsync(id);
            if (getRecordForSoftDelete != null)
            {
                getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
                getRecordForSoftDelete.DeletedBy = LoggedInUser;

                getRecordForSoftDelete.IsDeleted = true;

                _dbContext.Update(getRecordForSoftDelete);
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
        public async Task<DataQueryResponse<List<TestTypeResponse>>> GetTestTypeDetailAsync(DataQueryModel<TestTypeQueryModel> query)
        {
            var response = new DataQueryResponse<List<TestTypeResponse>>();

            var dataSource = await _dbContext.TblTestTypes.Where(f => f.IsDeleted.Equals(false)).Select(s => new TestTypeResponse()
            {
                TestTypeId = s.TestTypeId,
                TestType = s.TestType,
                TestTypeStatus = s.TestTypeStatus,

            }).ToListAsync();

            response.Result = dataSource;
            response.TotalRecord = dataSource.Count;

            #region Filtered
            if (query.QueryModel?.TestTypeId > 0)
            {
                response.Result = response.Result.Where(f => f.TestTypeId.Equals(query.QueryModel.TestTypeId)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TestType))
            {
                response.Result = response.Result.Where(f => f.TestType.ToLower().StartsWith(query.QueryModel.TestType.ToLower())).ToList();
            }
            if (query.QueryModel?.Status != null)
            {
                response.Result = response.Result.Where(f => f.TestTypeStatus.Equals(query.QueryModel.Status)).ToList();
            }
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                response.Result = response.Result.Skip((query.PageNumber - 1) * 1).Take(query.PageSize).ToList();
            }
            #endregion

            response.FilteredRecord = response.Result.Count;
            return response;
        }

        #region Lomokups
        public async Task<List<TestTypeLookup>> TestTypeLookupAsync()
        {
            var response = new List<TestTypeLookup>();

            var lookupSource = await _dbContext.TblTestTypes.Where(f => f.TestTypeStatus.Equals(true) && f.IsDeleted.Equals(false)).Select(s => new TestTypeLookup()
            {
                TestTypeId = s.TestTypeId,
                TestType = s.TestType

            }).ToListAsync();

            response = lookupSource;
            return response;
        }
        #endregion
    }
}
