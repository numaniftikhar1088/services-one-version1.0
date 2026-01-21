using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic;
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

namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class TestSetupService : ITestSetupService
    {
        //private readonly IConnectionManager _connectionManager;
        //private readonly IUtilityService _utilityService;
        //private readonly IHttpContextAccessor _httpContextAccessor;
        //private ApplicationDbContext _dbContext;
        //public TestSetupService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor)
        //{
        //    _connectionManager = connectionManager;
        //    _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
        //    _utilityService = utilityService;
        //    _httpContextAccessor = httpContextAccessor;
        //    LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        //}
        //public string LoggedInUser { get; set; }

        //public async Task<RequestResponse> SaveTestSetupAsync(SaveTestSetupRequest request)
        //{
        //    var response = new RequestResponse();

        //    var validation = new SaveTestSetupValidator();
        //    var validate = await validation.ValidateAsync(request);

        //    if (!validate.IsValid)
        //    {
        //        response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
        //        response.HttpStatusCode = Status.Failed;
        //        response.Status = "Validation Failed !";
        //        response.Message = "Request Failed !";
        //        return response;
        //    }

        //    _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        //    var entity = _utilityService.Converstion<SaveTestSetupRequest, TblTestSetup>(request);

        //    if (entity.TestId > 0)
        //    {
        //        var getRecordForEdit = await _dbContext.TblTestSetups.FindAsync(entity.TestId);
        //        if (getRecordForEdit != null)
        //        {

        //            entity.UpdatedDate = DateTimeNow.Get;
        //            entity.UpdatedBy = LoggedInUser;

        //            entity.CreatedDate = getRecordForEdit.CreatedDate;
        //            entity.CreatedBy = getRecordForEdit.CreatedBy;

        //            _dbContext.TblTestSetups.Update(entity);
        //            response.Message = "Record is Updated...";

        //        }
        //        else
        //        {
        //            response.Error = $"Record is not exist against ID : {entity.TestId} in our system...";
        //            response.HttpStatusCode = Status.Failed;
        //            response.Status = "Failed !";
        //            response.Message = "Request Failed !";
        //            return response;
        //        }
        //    }
        //    else
        //    {

        //        entity.CreatedBy = LoggedInUser;
        //        entity.CreatedDate = DateTimeNow.Get;

        //        entity.IsDeleted = false;

        //        if (entity.TestStatus == null)
        //            entity.TestStatus = true;

        //        await _dbContext.AddAsync(entity);
        //        response.Message = "Record is Added...";
        //    }

        //    var ack = await _dbContext.SaveChangesAsync();
        //    if (ack > 0)
        //    {
        //        response.HttpStatusCode = Status.Success;
        //        response.Status = "Success !";
        //    }
        //    return response;
        //}
        //public async Task<RequestResponse> ChangeTestSetupStatusAsync(ChangeTestSetupStatusRequest request)
        //{
        //    var response = new RequestResponse();

        //    var validation = new ChangeTestSetupStatusValidator();
        //    var validate = await validation.ValidateAsync(request);

        //    if (!validate.IsValid)
        //    {
        //        response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
        //        response.HttpStatusCode = Status.Failed;
        //        response.Status = "Validation Failed !";
        //        response.Message = "Request Failed !";
        //        return response;
        //    }
        //    var getRecordForStatusChanged = await _dbContext.TblTestSetups.FindAsync(request.TestId);
        //    if (getRecordForStatusChanged != null)
        //    {
        //        getRecordForStatusChanged.UpdatedBy = LoggedInUser;
        //        getRecordForStatusChanged.UpdatedDate = DateTimeNow.Get;

        //        getRecordForStatusChanged.TestStatus = request.TestStatus;
        //        _dbContext.Update(getRecordForStatusChanged);
        //        response.Message = "Status Changed...";
        //    }
        //    else
        //    {
        //        response.Error = $"Record is not exist against ID : {request.TestId} in our system...";
        //        response.HttpStatusCode = Status.Failed;
        //        response.Status = "Failed !";
        //        response.Message = "Request Failed !";
        //        return response;
        //    }
        //    var ack = await _dbContext.SaveChangesAsync();
        //    if (ack > 0)
        //    {
        //        response.HttpStatusCode = Status.Success;
        //        response.Status = "Success !";
        //    }
        //    return response;

        //}
        //public async Task<RequestResponse> DeleteTestSetupByIdAsync(int id)
        //{
        //    var response = new RequestResponse();

        //    if (id <= 0)
        //    {
        //        response.Error = "invalid ID !";
        //        response.Status = "Failed";
        //        response.Message = "Request Failed !";
        //        response.HttpStatusCode = Status.Failed;
        //        return response;

        //    }
        //    var getRecordForSoftDelete = await _dbContext.TblTestSetups.FindAsync(id);
        //    if (getRecordForSoftDelete != null)
        //    {
        //        getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
        //        getRecordForSoftDelete.DeletedBy = LoggedInUser;

        //        getRecordForSoftDelete.IsDeleted = true;

        //        _dbContext.Update(getRecordForSoftDelete);
        //        response.Message = "Record Deleted...";
        //    }
        //    else
        //    {
        //        response.Error = $"Record is not exist against ID : {id} in our system...";
        //        response.HttpStatusCode = Status.Failed;
        //        response.Status = "Failed !";
        //        response.Message = "Request Failed !";
        //        return response;
        //    }
        //    var ack = await _dbContext.SaveChangesAsync();
        //    if (ack > 0)
        //    {
        //        response.HttpStatusCode = Status.Success;
        //        response.Status = "Success !";
        //    }
        //    return response;
        //}
        //public async Task<DataQueryResponse<List<GetTestSetupDetailResponse>>> GetTestSetupDetailAsync(DataQueryModel<TestSetupQueryModel> query)
        //{
        //    var response = new DataQueryResponse<List<GetTestSetupDetailResponse>>();

        //    #region Source
        //    var requisitionType = await _dbContext.TblRequisitionTypes.Where(f => f.IsDeleted == false || f.IsDeleted == null).Select(s =>
        //    new
        //    {
        //        ReqTypeId = s.ReqTypeId,
        //        RequisitionType = s.RequisitionType

        //    }).ToListAsync();

        //    var testType = await _dbContext.TblTestTypes.Where(f => f.IsDeleted == false || f.IsDeleted == null).Select(s =>
        //    new
        //    {
        //        TestTypeID = s.TestTypeId,
        //        TestType = s.TestType

        //    }).ToListAsync();

        //    var testSetup = await _dbContext.TblTestSetups.Where(f => f.IsDeleted == false || f.IsDeleted == null).Select(s =>
        //    new
        //    {

        //        TestId = s.TestId,
        //        TestTypeId = s.TestTypeId,
        //        TestName = s.TestName,
        //        TestDisplayName = s.TestDisplayName,
        //        TMITCode = s.Tmitcode,
        //        TestType = s.TestTypeId,
        //        ReqTypeId = s.ReqTypeId,
        //        Status = s.TestStatus

        //    }).ToListAsync();
        //    #endregion

        //    var dataSource = (
        //        from TestSetup in testSetup
        //        join TestType in testType on TestSetup.TestTypeId equals TestType.TestTypeID
        //        into TestSetupTestType
        //        from TestSetupPlusTestType in TestSetupTestType.DefaultIfEmpty()
        //        join RequsitionType in requisitionType on TestSetup.ReqTypeId equals RequsitionType.ReqTypeId
        //        into TestSetupRequsitionType
        //        from TestSetupPlusRequsitionType in TestSetupRequsitionType.DefaultIfEmpty()
        //        select new GetTestSetupDetailResponse()
        //        {
        //            RequsitionType = TestSetupPlusRequsitionType == null ? "NA" : TestSetupPlusRequsitionType.RequisitionType,
        //            Status = TestSetup.Status,
        //            TestDisplayName = TestSetup.TestDisplayName,
        //            TestId = TestSetup.TestId,
        //            TestName = TestSetup.TestName,
        //            TestType = TestSetupPlusTestType == null ? "NA" : TestSetupPlusTestType.TestType,
        //            TMITCode = TestSetup.TMITCode,


        //        }).DistinctBy(d => d.TestId).OrderByDescending(o => o.TestId).ToList();

        //    response.TotalRecord = dataSource.Count;

        //    #region Filter

        //    if (query.QueryModel?.TestId > 0)
        //    {
        //        dataSource = dataSource.Where(f => f.TestId.Equals(query.QueryModel?.TestId)).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.TestName))
        //    {
        //        dataSource = dataSource.Where(f => f.TestName.ToLower().StartsWith(query.QueryModel?.TestName.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.TestDisplayName))
        //    {
        //        dataSource = dataSource.Where(f => f.TestDisplayName.ToLower().StartsWith(query.QueryModel?.TestDisplayName.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.TMITCode))
        //    {
        //        dataSource = dataSource.Where(f => f.TMITCode.ToLower().StartsWith(query.QueryModel?.TMITCode.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.TestType))
        //    {
        //        dataSource = dataSource.Where(f => f.TestType.ToLower().StartsWith(query.QueryModel?.TestType.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.RequsitionType))
        //    {
        //        dataSource = dataSource.Where(f => f.RequsitionType.ToLower().StartsWith(query.QueryModel?.RequsitionType.ToLower())).ToList();
        //    }
        //    if (query.QueryModel?.TestStatus != null)
        //    {
        //        dataSource = dataSource.Where(f => f.Status.Equals(query.QueryModel?.TestStatus)).ToList();
        //    }
        //    if (query.PageNumber > 0 && query.PageSize > 0)
        //    {
        //        dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
        //    }

        //    response.FilteredRecord = dataSource.Count;
        //    response.Result = dataSource;

        //    #endregion
        //    return response;
        //}
        //public async Task<RequestResponse<List<TestSetupLookup>>> TestSetupLookupAsync()
        //{
        //    var response = new RequestResponse<List<TestSetupLookup>>();

        //    var dataSource = await _dbContext.TblTestSetups.Where(f => f.IsDeleted == false && f.TestStatus == true)
        //        .Select(s => new TestSetupLookup()
        //        {
        //            TestId = s.TestId,
        //            TestDisplayName = s.TestDisplayName

        //        }).ToListAsync();

        //    response.Data = dataSource;
        //    response.HttpStatusCode = Status.Success;
        //    response.Status = "Success";
        //    response.Message = "Request Processed...";

        //    return response;
        //}

        //public async Task<RequestResponse<List<RequisitionTypeLookup>>> RequisitionTypeLookupAsync()
        //{
        //    var response = new RequestResponse<List<RequisitionTypeLookup>>();

        //    var lookupData = await _dbContext.TblRequisitionTypes.Select(s => new RequisitionTypeLookup()
        //    {
        //        ReqTypeId = s.ReqTypeId,
        //        RequisitionTypeName = s.RequisitionTypeName

        //    }).ToListAsync();

        //    response.Data = lookupData;
        //    response.Status = "Success";
        //    response.Message = "Request Processed...";
        //    response.HttpStatusCode = Status.Success;

        //    return response;
        //}
        public Task<RequestResponse> ChangeTestSetupStatusAsync(ChangeTestSetupStatusRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<RequestResponse> DeleteTestSetupByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<DataQueryResponse<List<GetTestSetupDetailResponse>>> GetTestSetupDetailAsync(DataQueryModel<TestSetupQueryModel> query)
        {
            throw new NotImplementedException();
        }

        public Task<RequestResponse<List<RequisitionTypeLookup>>> RequisitionTypeLookupAsync()
        {
            throw new NotImplementedException();
        }

        public Task<RequestResponse> SaveTestSetupAsync(SaveTestSetupRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<RequestResponse<List<TestSetupLookup>>> TestSetupLookupAsync()
        {
            throw new NotImplementedException();
        }
    }
}
