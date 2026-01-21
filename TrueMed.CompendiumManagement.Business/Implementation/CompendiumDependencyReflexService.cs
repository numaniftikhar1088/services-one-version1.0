using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Business.Interface;
using TrueMed.Validator.CompendiumManagement;
using TrueMed.Business.TenantDbContext;

namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class CompendiumDependencyReflexService : ICompendiumDependencyReflexService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;
        private ApplicationDbContext _dbContext;
        public CompendiumDependencyReflexService(IConnectionManager connectionManager, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse> SaveAsync(SaveCompendiumDependencyReflexRequest request)
        {
            var response = new RequestResponse();

            var validation = new CompendiumDependencyReflexValidator();
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
            var entity = _mapper.Map<SaveCompendiumDependencyReflexRequest, TblCompendiumDependencyAndReflexTest>(request);

            if (entity.Id > 0)
            {
                var getRecordForEdit = await _dbContext.TblCompendiumDependencyAndReflexTests.FindAsync(entity.Id);
                if (getRecordForEdit != null)
                {
                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;

                    _dbContext.TblCompendiumDependencyAndReflexTests.Update(entity);
                    response.Message = "Record is Updated...";

                }
                else
                {
                    response.Error = $"Record is not exist against ID : {entity.Id} in our system...";
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

                if (entity.IsActive == null)
                    entity.IsActive = true;

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
        public async Task<RequestResponse> DeleteAsync(int id)
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
            var getRecordForSoftDelete = await _dbContext.TblCompendiumDependencyAndReflexTests.FindAsync(id);
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
        public async Task<DataQueryResponse<List<GetCompendiumDependencyReflexResponse>>> GetAsync(DataQueryModel<BloodCompendiumReflexTestQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetCompendiumDependencyReflexResponse>>();

            var dataSource = await _dbContext.TblCompendiumDependencyAndReflexTests.Select(s => new GetCompendiumDependencyReflexResponse()
            {
                Id = s.Id,
                ParentTestAssignmentId = s.ParentTestAssignmentId,
                ChildTestAssignmentId = s.ChildTestAssignmentId,
                ChildType = s.ChildType,
                SortOrder = s.SortOrder
            }).ToListAsync();

            response.Result = dataSource;
            response.TotalRecord = dataSource.Count;

            return response;
        }
    }
}
