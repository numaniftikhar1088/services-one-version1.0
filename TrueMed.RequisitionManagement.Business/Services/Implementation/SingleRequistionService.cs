using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Business.Interface;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;
using TrueMed.Business.TenantDbContext;
namespace TrueMed.RequisitionManagement.Business.Services.Implementation
{
    public class SingleRequistionService : ISingleRequistionService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserManagement _userManagement;
        private IMapper _mapper;
        private ApplicationDbContext _dbContext;
        public SingleRequistionService(IConnectionManager connectionManager, IHttpContextAccessor httpContextAccessor, IMapper mapper, IUserManagement userManagement)
        {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            _userManagement = userManagement;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse> SaveSingleRequisitionAsync(SaveSingleRequistionRequest request)
        {
            var response = new RequestResponse();

            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

            var entity = _mapper.Map<TblRequisitionMaster>(request);

            if (entity.RequisitionId > 0)
            {
                var getRecordForEdit = await _dbContext.TblRequisitionMasters.FindAsync(entity.RequisitionId);
                if (getRecordForEdit != null)
                {

                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;

                    _dbContext.TblRequisitionMasters.Update(entity);
                    response.Message = "Record is Updated...";

                }
                else
                {
                    response.Error = $"Record is not exist against ID : {entity.RequisitionId} in our system...";
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

                //if (string.IsNullOrWhiteSpace(entity.RequisitionStatus))
                //    entity.RequisitionStatus = "Open";

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
        public async Task<RequestResponse> DeleteSingleRequisitionByIdAsync(int id)
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
            var getRecordForSoftDelete = await _dbContext.TblRequisitionMasters.FindAsync(id);
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

        public RequestResponse<List<FacilityLookupForRequsitionResponse>> FacilityLookupForRequisition()
        {
            var response = new RequestResponse<List<FacilityLookupForRequsitionResponse>>();
            string role = _userManagement.GetUserTypeById(LoggedInUser).ToString() ?? "";

            var facilityResult = _dbContext.TblFacilities.Select(s =>
                        new
                        {
                            FacilityID = s.FacilityId,
                            FacilityName = s.FacilityName,
                            User = s.CreatedBy

                        }).OrderByDescending(o => o.FacilityName).ToList();

            if (role != "Admin")
            {
                facilityResult = facilityResult.Select(s => new
                {
                    FacilityID = s.FacilityID,
                    FacilityName = s.FacilityName,
                    User = s.User

                }).Where(f => f.User == LoggedInUser).ToList();
            }
            else
            {
                facilityResult = facilityResult.Select(s => new
                {
                    FacilityID = s.FacilityID,
                    FacilityName = s.FacilityName,
                    User = s.User

                }).ToList();
            }
            response.Data = facilityResult.Select(s => new FacilityLookupForRequsitionResponse() { FacilityId = s.FacilityID, FacilityName = s.FacilityName }).ToList();
            response.HttpStatusCode = Status.Success;
            return response;
        }
    }
}
