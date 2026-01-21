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
namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation
{
    public class TestSetupService : ITestSetupService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private MasterDbContext _masterDbContext;
        private IMapper _mapper;

        public TestSetupService(IHttpContextAccessor httpContextAccessor, MasterDbContext masterDbContext, IConnectionManager connectionManager, IMapper mapper)
        {
            _httpContextAccessor = httpContextAccessor;
            _masterDbContext = masterDbContext;
            _mapper = mapper;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }

        public async Task<DataQueryResponse<List<GetTestSetupDetailResponse>>> GetTestSetupDetailAsync(DataQueryModel<TestSetupQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetTestSetupDetailResponse>>();

            #region DataSource
            var testSetupResult = await _masterDbContext.TblCompendiumTests.Where(f => f.IsDeleted.Equals(false)).ToListAsync();
            var requisitionTypeResult = await _masterDbContext.TblRequisitionTypes.ToListAsync();
            //var departmentResult = await _masterDbContext.TblDepartments.Where(x => x.IsDeleted.Equals(false)).ToListAsync();
            #endregion

            var dataSource = (from testSetup in testSetupResult
                              join requisitionType in requisitionTypeResult on testSetup.ReqTypeId equals requisitionType.ReqTypeId
                              into panelSetuprequisitionType
                              from panelSetupPlusrequisitionType in panelSetuprequisitionType.DefaultIfEmpty()
                                  //join department in departmentResult on testSetup.DeptId equals department.DeptId
                                  //into panelSetupdepartment
                                  //from panelSetupPlusdepartment in panelSetupdepartment.DefaultIfEmpty()
                              select new GetTestSetupDetailResponse()
                              {
                                  Id = testSetup.Id,
                                  TestName = testSetup.TestName,
                                  Tmitcode = testSetup.Tmitcode,
                                  IsActive = testSetup.IsActive,
                                  NetworkType = testSetup.NetworkType,
                                  ReqTypeId = testSetup.ReqTypeId,
                                  RequisitionType = panelSetupPlusrequisitionType == null ? "NA" : panelSetupPlusrequisitionType.RequisitionType
                                  //DeptId = testSetup.DeptId,
                                  //DepartmentName = panelSetupPlusdepartment == null ? "NA" : panelSetupPlusdepartment.DepartmentName

                              }).DistinctBy(d => d.Id).OrderByDescending(o => o.Id).ToList();

            #region Filtered
            if (query.QueryModel?.Id > 0)
            {
                dataSource = dataSource.Where(f => f.Id.Equals(query.QueryModel.Id)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TestName))
            {
                dataSource = dataSource.Where(f => f.TestName !=null && f.TestName.ToLower().Contains(query.QueryModel?.TestName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Tmitcode))
            {
                dataSource = dataSource.Where(f => f.Tmitcode != null && f.Tmitcode.ToLower().Contains(query.QueryModel?.Tmitcode.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionType))
            {
                dataSource = dataSource.Where(f => f.RequisitionType.ToLower().Contains(query.QueryModel?.RequisitionType.ToLower())).ToList();
            }
            //if (!string.IsNullOrEmpty(query.QueryModel?.DepartmentName))
            //{
            //    dataSource = dataSource.Where(f => f.DepartmentName.ToLower().Contains(query.QueryModel?.DepartmentName.ToLower())).ToList();
            //}
            if (query.QueryModel?.IsActive != null)
            {
                dataSource = dataSource.Where(f => f.IsActive.Equals(query.QueryModel.IsActive)).ToList();
            }
            if (query.QueryModel?.NetworkType > 0)
            {
                dataSource = dataSource.Where(f => f.NetworkType.Equals(query.QueryModel.NetworkType)).ToList();
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
        public async Task<RequestResponse<GetTestSetupDetailByIdResponse>> GetTestSetupDetailByIdAsync(int id)
        {
            var response = new RequestResponse<GetTestSetupDetailByIdResponse>();
            #region DataSource
            var testSetupResult = await _masterDbContext.TblCompendiumTests.Where(f => f.IsDeleted.Equals(false)).ToListAsync();
            var requisitionTypeResult = await _masterDbContext.TblRequisitionTypes.ToListAsync();
            //var departmentResult = await _masterDbContext.TblDepartments.Where(x => x.IsDeleted.Equals(false)).ToListAsync();
            #endregion

            var dataSource = (from testSetup in testSetupResult
                              join requisitionType in requisitionTypeResult on testSetup.ReqTypeId equals requisitionType.ReqTypeId
                              into panelSetuprequisitionType
                              from panelSetupPlusrequisitionType in panelSetuprequisitionType.DefaultIfEmpty()
                                  //join department in departmentResult on testSetup.DeptId equals department.DeptId
                                  //into panelSetupdepartment
                                  //from panelSetupPlusdepartment in panelSetupdepartment.DefaultIfEmpty()
                              select new GetTestSetupDetailByIdResponse()
                              {
                                  Id = testSetup.Id,
                                  TestName = testSetup.TestName,
                                  Tmitcode = testSetup.Tmitcode,
                                  IsActive = testSetup.IsActive,
                                  NetworkType = testSetup.NetworkType,
                                  ReqTypeId = testSetup.ReqTypeId,
                                  RequisitionType = panelSetupPlusrequisitionType == null ? "NA" : panelSetupPlusrequisitionType.RequisitionType
                                  //DeptId = testSetup.DeptId,
                                  //DepartmentName = panelSetupPlusdepartment == null ? "NA" : panelSetupPlusdepartment.DepartmentName

                              }).FirstOrDefault(d => d.Id.Equals(id));

            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Data = dataSource;
            return response;
        }
        public async Task<RequestResponse> SaveTestSetupAsync(SaveTestSetupRequest request)
        {
            var response = new RequestResponse();

            var validation = new SaveTestSetupRequestValidator();
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
            var entity = _mapper.Map<TblCompendiumTest>(request);

            if (entity.Id > 0)
            {
                var getRecordForEdit = await _masterDbContext.TblCompendiumTests.FindAsync(entity.Id);
                if (getRecordForEdit != null)
                {
                    //entity.TestDisplayName = entity.TestName;

                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;

                    _masterDbContext.TblCompendiumTests.Update(entity);
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
                //entity.TestDisplayName = entity.TestName;

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
        public async Task<RequestResponse> ChangeTestSetupStatusAsync(ChangeTestSetupStatusRequest request)
        {
            var response = new RequestResponse();

            var validation = new ChangeTestSetupStatusValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
                response.HttpStatusCode = Status.Failed;
                response.Status = "Validation Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var getRecordForStatusChanged = await _masterDbContext.TblCompendiumTests.FindAsync(request.Id);
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
        public async Task<RequestResponse> DeleteTestSetupByIdAsync(int id)
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
            var getRecordForSoftDelete = await _masterDbContext.TblCompendiumTests.FindAsync(id);
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


        public async Task<RequestResponse<List<TestSetupLookup>>> TestSetupLookupAsync()
        {
            var response = new RequestResponse<List<TestSetupLookup>>();

            var data = await _masterDbContext.TblCompendiumTests.Where(f => f.IsDeleted == false && f.IsActive == true).Select(s => new TestSetupLookup()
            {
                TestId = s.Id,
                TestDisplayName = s.TestName
            }).ToListAsync();

            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed...";
            response.Data = data;

            return response;
        }
    }
}
