using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Validator.CompendiumManagement;

namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class PanelSetupService : IPanelSetupService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private IMapper _mapper;
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly IConnectionManager _connectionManager;
        private readonly ICacheManager _cache;
        public PanelSetupService(IHttpContextAccessor httpContextAccessor, ApplicationDbContext applicationDbContext, IConnectionManager connectionManager, IMapper mapper, ICacheManager cache)
        {
            _httpContextAccessor = httpContextAccessor;
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
            _cache = cache;
        }
        public string LoggedInUser { get; set; }

        public async Task<DataQueryResponse<List<GetPanelSetupDetailResponse>>> GetAllPanelsAsync(DataQueryModel<PanelSetupQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetPanelSetupDetailResponse>>();

            var cacheResponse = await _cache.GetAsync<List<GetPanelSetupDetailResponse>>($"{nameof(GetAllPanelsAsync)}");
            if (cacheResponse.IsSuccess == true && cacheResponse.Value.Count() > 0)
            {
                response.TotalRecord = cacheResponse.Value.Count();
                response.Result = cacheResponse.Value;
                return response;
            }

            #region DataSource
            var panelSetupResult = await _applicationDbContext.TblCompendiumPanels.Where(f => f.IsDeleted.Equals(false)).ToListAsync();
            var requisitionTypeResult = await _applicationDbContext.TblLabRequisitionTypes.ToListAsync();
            var departmentResult = await _applicationDbContext.TblDepartments.Where(x => x.IsDeleted.Equals(false)).ToListAsync();
            #endregion

            var dataSource = (from panelSetup in panelSetupResult
                              join requisitionType in requisitionTypeResult on panelSetup.ReqTypeId equals requisitionType.ReqTypeId
                              into panelSetuprequisitionType
                              from panelSetupPlusrequisitionType in panelSetuprequisitionType.DefaultIfEmpty()
                              join department in departmentResult on Convert.ToInt32(panelSetup.Department) equals department.DeptId
                              into panelSetupdepartment
                              from panelSetupPlusdepartment in panelSetupdepartment.DefaultIfEmpty()
                              select new GetPanelSetupDetailResponse()
                              {
                                  Id = panelSetup.Id,
                                  PanelName = panelSetup.PanelName,
                                  Tmitcode = panelSetup.Tmitcode,
                                  IsActive = panelSetup.IsActive,
                                  ReqTypeId = panelSetup.ReqTypeId,
                                  RequisitionTypeName = panelSetupPlusrequisitionType == null ? "NA" : panelSetupPlusrequisitionType.RequisitionType,
                                  DeptId = Convert.ToInt32(panelSetup.Department),
                                  DepartmentName = panelSetupPlusdepartment == null ? "NA" : panelSetupPlusdepartment.DepartmentName

                              }).DistinctBy(d => d.Id).OrderByDescending(o => o.Id).ToList();

            var cacheResponses = await _cache.SetAsync<List<GetPanelSetupDetailResponse>>($"{nameof(GetAllPanelsAsync)}",dataSource);

            #region Filtered

            if (!string.IsNullOrEmpty(query.QueryModel?.PanelName))
            {
                dataSource = dataSource.Where(f => f.PanelName.ToLower().Contains(query.QueryModel?.PanelName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Tmitcode))
            {
                dataSource = dataSource.Where(f => f.Tmitcode.ToLower().Contains(query.QueryModel?.Tmitcode.ToLower())).ToList();
            }
            if (query.QueryModel?.DeptId > 0)
            {
                dataSource = dataSource.Where(f => f.DeptId.Equals(query.QueryModel.DeptId)).ToList();
            }
            if (query.QueryModel?.ReqTypeId > 0)
            {
                dataSource = dataSource.Where(f => f.ReqTypeId.Equals(query.QueryModel.ReqTypeId)).ToList();
            }
            //if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionType))
            //{
            //    dataSource = dataSource.Where(f => f.RequisitionType.ToLower().Contains(query.QueryModel?.RequisitionType.ToLower())).ToList();
            //}
            //if (!string.IsNullOrEmpty(query.QueryModel?.DepartmentName))
            //{
            //    dataSource = dataSource.Where(f => f.DepartmentName.ToLower().Contains(query.QueryModel?.DepartmentName.ToLower())).ToList();
            //}
            if (query.QueryModel?.IsActive != null)
            {
                dataSource = dataSource.Where(f => f.IsActive.Equals(query.QueryModel.IsActive)).ToList();
            }
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion

            response.TotalRecord = dataSource.Count();
            response.Result = dataSource;
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

            _applicationDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            //var entity = _mapper.Map<TblCompendiumPanel>(request);
            var entity = new TblCompendiumPanel();
            entity.Id = request.Id;
            entity.PanelName = request.PanelName;
            entity.ReqTypeId = request.ReqTypeId;
            entity.Tmitcode = request.Tmitcode;
            entity.Department = Convert.ToString(request.DeptId);
            entity.IsActive = request.IsActive;

            if (entity.Id > 0)
            {
                var getRecordForEdit = await _applicationDbContext.TblCompendiumPanels.FindAsync(entity.Id);
                if (getRecordForEdit != null)
                {
                    //entity.PanelDisplayName = entity.PanelName;

                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;

                    _applicationDbContext.TblCompendiumPanels.Update(entity);
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
                //string dept = string.Join(",", request.DeptId);
                //string dept = (request.DeptId == 0 ? Convert.ToString(request.DeptId): "0");
                entity.Department = Convert.ToString(request.DeptId);
                entity.CreatedBy = LoggedInUser;
                entity.CreatedDate = DateTimeNow.Get;

                entity.IsDeleted = false;

                if (entity.IsActive == null)
                    entity.IsActive = true;

                await _applicationDbContext.AddAsync(entity);
                response.Message = "Record is Added...";
            }

            var ack = await _applicationDbContext.SaveChangesAsync();
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
            var getRecordForSoftDelete = await _applicationDbContext.TblCompendiumPanels.FindAsync(id);
            if (getRecordForSoftDelete != null)
            {
                getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
                getRecordForSoftDelete.DeletedBy = LoggedInUser;

                getRecordForSoftDelete.IsDeleted = true;

                _applicationDbContext.Update(getRecordForSoftDelete);
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
            var ack = await _applicationDbContext.SaveChangesAsync();
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
            var getRecordForStatusChanged = await _applicationDbContext.TblCompendiumPanels.FindAsync(request.Id);
            if (getRecordForStatusChanged != null)
            {
                getRecordForStatusChanged.UpdatedBy = LoggedInUser;
                getRecordForStatusChanged.UpdatedDate = DateTimeNow.Get;

                getRecordForStatusChanged.IsActive = request.IsActive;
                _applicationDbContext.Update(getRecordForStatusChanged);
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
            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;

        }
        //public PanelSetupService(
        //   IConnectionManager connectionManager,
        //   ApplicationDbContext applicationDbContext
        //   )
        //{
        //    this._applicationDbContext = applicationDbContext;
        //    this._connectionManager = connectionManager;
        //}
        //public IQueryable<PanelModel> GetAllPanels()
        //{
        //    //return _applicationDbContext.TblCompendiumPanels.Select(x => new PanelModel
        //    //{
        //    //    Id = x.Id,
        //    //    Name = x.PanelName,
        //    //    //DisplayName = x.PanelDisplayName,
        //    //    CreateBy = x.CreatedBy,
        //    //    CreateDate = x.CreatedDate,
        //    //    IsActive = x.IsActive,
        //    //    //PanelType = x.PanelTypeId,
        //    //    RequisitionType = x.ReqTypeId,
        //    //    TmitCode = x.Tmitcode,
        //    //    Department = x.Department,

        //    //}).OrderByDescending(x => x.CreateDate);
        //    return _applicationDbContext.TblCompendiumPanels
        //        .Join(_applicationDbContext.TblDepartments,
        //        prip => prip.Department,
        //        refer => refer.DepartmentName, (pri, refer) => new PanelModel
        //        {
        //            Id = pri.Id,
        //            Name = pri.PanelName,
        //            CreateBy = pri.CreatedBy,
        //            CreateDate = pri.CreatedDate,
        //            Department = pri.Department,
        //            DepartmentName = refer.DepartmentName,
        //            IsActive = pri.IsActive,
        //            RequisitionType = pri.ReqTypeId,
        //            TmitCode = pri.Tmitcode,
        //        });
        //}
    }
}
