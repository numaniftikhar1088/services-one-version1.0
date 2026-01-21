using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.LookupModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;
using TrueMed.Sevices.MasterEntities;
using TrueMed.Validator.MasterPortalAppManagement;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation
{
    public class PanelSetupService : IPanelSetupService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private MasterDbContext _masterDbContext;
        private ApplicationDbContext _applicationDbContext;
        private IMapper _mapper;

        public PanelSetupService(IHttpContextAccessor httpContextAccessor, MasterDbContext masterDbContext, IConnectionManager connectionManager, IMapper mapper)
        {
            _httpContextAccessor = httpContextAccessor;
            _masterDbContext = masterDbContext;
            //_applicationDbContext = applicationDbContext;
            _mapper = mapper;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }

        public async Task<DataQueryResponse<List<GetPanelSetupDetailResponse>>> GetPanelSetupDetailAsync(DataQueryModel<PanelSetupQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetPanelSetupDetailResponse>>();

            #region DataSource
            var panelSetupResult = await _masterDbContext.TblCompendiumPanels.Where(f => f.IsDeleted.Equals(false)).ToListAsync();
            var requisitionTypeResult = await _masterDbContext.TblRequisitionTypes.ToListAsync();

            #endregion

            var dataSource = (from panelSetup in panelSetupResult
                              join requisitionType in requisitionTypeResult on panelSetup.ReqTypeId equals requisitionType.ReqTypeId
                              into panelSetuprequisitionType
                              from panelSetupPlusrequisitionType in panelSetuprequisitionType.DefaultIfEmpty()
                              select new GetPanelSetupDetailResponse()
                              {
                                  Id = panelSetup.Id,
                                  PanelName = panelSetup.PanelName,
                                  Tmitcode = panelSetup.Tmitcode,
                                  IsActive = panelSetup.IsActive,
                                  ReqTypeId = panelSetup.ReqTypeId,
                                  NetworkType = panelSetup.NetworkType,
                                  RequisitionType = panelSetupPlusrequisitionType == null ? "NA" : panelSetupPlusrequisitionType.RequisitionType


                              }).DistinctBy(d => d.Id).OrderByDescending(o => o.Id).ToList();

            #region Filtered
            if (query.QueryModel?.Id > 0)
            {
                dataSource = dataSource.Where(f => f.Id.Equals(query.QueryModel.Id)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.PanelName))
            {
                dataSource = dataSource.Where(f => f.PanelName != null && f.PanelName.ToLower().Contains(query.QueryModel?.PanelName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Tmitcode))
            {
                dataSource = dataSource.Where(f => f.Tmitcode != null && f.Tmitcode.ToLower().Contains(query.QueryModel?.Tmitcode.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionType))
            {
                dataSource = dataSource.Where(f => f.RequisitionType != null && f.RequisitionType.ToLower().Contains(query.QueryModel?.RequisitionType.ToLower())).ToList();
            }
            if (query.QueryModel?.NetworkType > 0)
            {
                dataSource = dataSource.Where(f => f.NetworkType.Equals(query.QueryModel.NetworkType)).ToList();
            }
            if (query.QueryModel?.IsActive != null)
            {
                dataSource = dataSource.Where(f => f.IsActive.Equals(query.QueryModel.IsActive)).ToList();
            }
            response.Total = dataSource.Count();
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion

            
            response.Data = dataSource;
            return response;
        }
        public async Task<RequestResponse<GetPanelSetupDetailByIdResponse>> GetPanelSetupDetailByIdAsync(int id)
        {
            var response = new RequestResponse<GetPanelSetupDetailByIdResponse>();

            #region DataSource
            var panelSetupResult = await _masterDbContext.TblCompendiumPanels.Where(f => f.IsDeleted.Equals(false)).ToListAsync();
            var requisitionTypeResult = await _masterDbContext.TblRequisitionTypes.ToListAsync();
            //var departmentResult = await _applicationDbContext.TblDepartments.Where(x => x.IsDeleted.Equals(false)).ToListAsync();
            #endregion

            var dataSource = (from panelSetup in panelSetupResult
                                  join requisitionType in requisitionTypeResult on panelSetup.ReqTypeId equals requisitionType.ReqTypeId
                                  into panelSetuprequisitionType
                                  from panelSetupPlusrequisitionType in panelSetuprequisitionType.DefaultIfEmpty()
                                  //join department in departmentResult on panelSetup.DeptId equals department.DeptId
                                  //into panelSetupdepartment
                                  //from panelSetupPlusdepartment in panelSetupdepartment.DefaultIfEmpty()
                              select new GetPanelSetupDetailByIdResponse()
                              {
                                  Id = panelSetup.Id,
                                  PanelName = panelSetup.PanelName,
                                  Tmitcode = panelSetup.Tmitcode,
                                  NetworkType = panelSetup.NetworkType,
                                  IsActive = panelSetup.IsActive,
                                  ReqTypeId = panelSetup.ReqTypeId,
                                  RequisitionType = panelSetupPlusrequisitionType == null ? "NA" : panelSetupPlusrequisitionType.RequisitionType,
                                  //DeptId = panelSetup.DeptId,
                                  //DepartmentName = panelSetupPlusdepartment == null ? "NA" : panelSetupPlusdepartment.DepartmentName

                              }).FirstOrDefault(d => d.Id.Equals(id));
            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Data = dataSource;
            return response;
        }
        public async Task<RequestResponse> SavePanelSetupAsync(SavePanelSetupRequest request)
        {
            var response = new RequestResponse();

            var validation = new SavePanelSetupRequestValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
                response.HttpStatusCode = Status.Failed;
                response.Status = "Validation Failed !";
                response.Message = "Request Failed !";
                return response;
            }

            _masterDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            var entity = _mapper.Map<TblCompendiumPanel>(request);

            if (entity.Id > 0)
            {
                var getRecordForEdit = await _masterDbContext.TblCompendiumPanels.FindAsync(entity.Id);
                if (getRecordForEdit != null)
                {
                    //entity.PanelDisplayName = entity.PanelName;

                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;

                    _masterDbContext.TblCompendiumPanels.Update(entity);
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
                //entity.PanelDisplayName = entity.PanelName;

                entity.CreatedBy = LoggedInUser;
                entity.CreatedDate = DateTimeNow.Get;

                entity.IsDeleted = false;

                if (entity.IsActive == null)
                    entity.IsActive = true;

                await _masterDbContext.AddAsync(entity);
                response.Message = "Record is Added...";
            }

            var ack = await _masterDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }
        public async Task<RequestResponse> DeletePanelSetupByIdAsync(int id)
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
            var getRecordForSoftDelete = await _masterDbContext.TblCompendiumPanels.FindAsync(id);
            if (getRecordForSoftDelete != null)
            {
                getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
                getRecordForSoftDelete.DeletedBy = LoggedInUser;

                getRecordForSoftDelete.IsDeleted = true;

                _masterDbContext.Update(getRecordForSoftDelete);
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
            var ack = await _masterDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }
        public async Task<RequestResponse> ChangePanelSetupStatusAsync(ChangePanelSetupStatusRequest request)
        {
            var response = new RequestResponse();

            var validation = new ChangePanelSetupStatusValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
                response.HttpStatusCode = Status.Failed;
                response.Status = "Validation Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var getRecordForStatusChanged = await _masterDbContext.TblCompendiumPanels.FindAsync(request.Id);
            if (getRecordForStatusChanged != null)
            {
                getRecordForStatusChanged.UpdatedBy = LoggedInUser;
                getRecordForStatusChanged.UpdatedDate = DateTimeNow.Get;

                getRecordForStatusChanged.IsActive = request.IsActive;
                _masterDbContext.Update(getRecordForStatusChanged);
                response.Message = "Status Changed...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {request.Id} in our system...";
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var ack = await _masterDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;

        }


        public async Task<RequestResponse<List<PanelSetupLookup>>> PanelSetupLookupAsync()
        {
            var response = new RequestResponse<List<PanelSetupLookup>>();

            var data = await _masterDbContext.TblCompendiumPanels.Where(f => f.IsDeleted == false && f.IsActive == true).Select(s => new PanelSetupLookup()
            {
                PanelId = s.Id,
                PanelDisplayName = s.PanelName,
            }).ToListAsync();

            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed...";
            response.Data = data;

            return response;
        }
        public async Task<RequestResponse<List<RequisitionTypeLookup>>> RequisitionTypeLookupAsync()
        {
            var response = new RequestResponse<List<RequisitionTypeLookup>>();

            var data = await _masterDbContext.TblRequisitionTypes.Where(f => f.IsDeleted == false && f.ReqStatus == true).Select(s => new RequisitionTypeLookup()
            {
                ReqTypeId = s.ReqTypeId,
                RequisitionTypeName = s.RequisitionTypeName
            }).ToListAsync();

            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed...";
            response.Data = data;

            return response;
        }
        public async Task<RequestResponse<List<DepartmentLookup>>> DepartmentLookupAsync()
        {
            var response = new RequestResponse<List<DepartmentLookup>>();

            var data = await _applicationDbContext.TblDepartments.Where(f => f.IsDeleted == false && f.DeptStatus == true).Select(s => new DepartmentLookup()
            {
                DeptId = s.DeptId,
                DepartmentName = s.DepartmentName
            }).ToListAsync();

            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed...";
            response.Data = data;

            return response;
        }

    }
}
