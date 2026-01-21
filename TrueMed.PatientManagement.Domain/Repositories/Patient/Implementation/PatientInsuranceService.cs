using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.PatientManagement.Domain.Models.Patient.Request;
using TrueMed.PatientManagement.Domain.Models.Patient.Response;
using TrueMed.PatientManagement.Domain.QueryModel;
using TrueMed.PatientManagement.Domain.QueryModel.Base;
using TrueMed.PatientManagement.Domain.Repositories.Patient.Interface;
using TrueMed.PatientManagement.Domain.ResponseModel;

namespace TrueMed.PatientManagement.Domain.Repositories.Patient.Implementation
{
    public class PatientInsuranceService : IPatientInsuranceService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        ApplicationDbContext _applicationDbContext;
        MasterDbContext _masterDbContext;

        public PatientInsuranceService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor, MasterDbContext masterDbContext)
        {
            _applicationDbContext = ApplicationDbContext.Create(connectionManager);
            this._connectionManager = connectionManager;
            _utilityService = utilityService;
            _httpContextAccessor = httpContextAccessor;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
            _masterDbContext = masterDbContext;
        }
        public string LoggedInUser { get; set; }

        public async Task<RequestResponse> SavePatientInsuranceAsync(SavePatientInsuranceViewModel entity)
        {
            var response = new RequestResponse();
            var convertedEntity = _utilityService.Converstion<SavePatientInsuranceViewModel, TblPatientInsurance>(entity);
            _applicationDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            if (convertedEntity.PatientInsuranceId > 0)
            {
                var recordForEdit = await _applicationDbContext.TblPatientInsurances.FindAsync(convertedEntity.PatientInsuranceId).ConfigureAwait(false);
                if (recordForEdit != null)
                {
                    var createdBy = recordForEdit.CreatedBy;
                    var createddate = recordForEdit.CreatedDate;
                    recordForEdit = convertedEntity;
                    recordForEdit.CreatedDate = createddate;
                    recordForEdit.CreatedBy = createdBy;
                    recordForEdit.UpdatedDate = DateTimeNow.Get;
                    recordForEdit.UpdatedBy = LoggedInUser;
                    _applicationDbContext.TblPatientInsurances.Update(recordForEdit);
                    response.Message = "Record Updated !";
                }
                else
                {
                    response.Error = $"record is not exist against ID : {convertedEntity.PatientInsuranceId} in our system !";
                    response.Status = "failed";
                    response.HttpStatusCode = Status.Failed;
                    response.Message = "Request failed !";
                    return response;
                }
            }
            else
            {
                convertedEntity.CreatedBy = LoggedInUser;
                convertedEntity.CreatedDate = DateTimeNow.Get;
                await _applicationDbContext.TblPatientInsurances.AddAsync(convertedEntity).ConfigureAwait(false);
                response.Message = "Record is Added !";
            }
            var ack = await _applicationDbContext.SaveChangesAsync().ConfigureAwait(false);
            if (ack > 0)
            {
                response.Status = "Success";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }
        public async Task<DataQueryResponse<List<GetPatientInsuranceDetailViewModel>>> GetPatientInsuranceDetailAsync(DataQueryModel<PatientInsuranceQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetPatientInsuranceDetailViewModel>>();
            var patientInsuranceDataFromDemoDB = await _applicationDbContext.TblPatientInsurances.ToListAsync().ConfigureAwait(false);
            var insuranceTypeDataFromMasterDB = await _masterDbContext.TblInsuranceSetups.ToListAsync().ConfigureAwait(false);
            var insuranceProviderDataFromMasterDB = await _masterDbContext.TblInsuranceProviders.ToListAsync().ConfigureAwait(false);
            var result = (
                from insuranceType in insuranceTypeDataFromMasterDB
                join patientInsurance in patientInsuranceDataFromDemoDB on insuranceType.InsuranceId equals patientInsurance.InsuranceId
                join insuranceProvider in insuranceProviderDataFromMasterDB on patientInsurance.InsuranceProviderId equals insuranceProvider.InsuranceProviderId
                select new GetPatientInsuranceDetailViewModel()
                {
                    PatientInsuranceId = patientInsurance.PatientInsuranceId,
                    PatientId = patientInsurance.PatientId,
                    InsuranceId = insuranceType.InsuranceId,
                    InsuranceName = insuranceType.InsuranceName,
                    InsuranceType = insuranceType.InsuranceType,
                    InsuranceProviderId = insuranceProvider.InsuranceProviderId,
                    ProviderName = insuranceProvider.ProviderName,
                    ProviderCode = insuranceProvider.ProviderCode,
                    GroupNumber = patientInsurance.PrimaryGroupId,
                    PolicyId = patientInsurance.PrimaryPolicyId,
                    SubscriberName = patientInsurance.SubscriberName,

                    SubscriberDOB = patientInsurance.SubscriberDob,
                    ReslationShipToInsured = patientInsurance.RelationshipToInsured.TrimEnd(),
                    InsurancePhoneNumbr = patientInsurance.InsurancePhone,
                    AccidentDate = patientInsurance.AccidentDate,
                    AccidentType = patientInsurance.AccidentType,
                    AccidentState = patientInsurance.AccidentState

                }).ToList();
            #region Filtered
            if (!string.IsNullOrEmpty(query.QueryModel?.GroupNumber))
            {
                result = result.Where(f => f.GroupNumber.Equals(query.QueryModel.GroupNumber)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.PolicyId))
            {
                result = result.Where(f => f.PolicyId.Equals(query.QueryModel.PolicyId)).ToList();
            }
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                result = result.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion
            response.Total = result.Count;
            response.Data = result;
            return response;
        }
        public async Task<RequestResponse<GetPatientInsuranceDetailByPatientIdViewModel>> GetPatientInsuranceDetailByPatientIdAsync(int id)
        {
            var response = new RequestResponse<GetPatientInsuranceDetailByPatientIdViewModel>();
            if (id <= 0)
            {
                response.Status = "Failed";
                response.HttpStatusCode = Status.Failed;
                response.Message = "invalid ID !";
                return response;
            }
            var patientInsuranceDataFromDemoDB = await _applicationDbContext.TblPatientInsurances.ToListAsync().ConfigureAwait(false);
            var insuranceTypeDataFromMasterDB = await _masterDbContext.TblInsuranceSetups.ToListAsync().ConfigureAwait(false);
            var insuranceProviderDataFromMasterDB = await _masterDbContext.TblInsuranceProviders.ToListAsync().ConfigureAwait(false);

            var result = (
                from patientInsurance in patientInsuranceDataFromDemoDB
                join insuranceType in insuranceTypeDataFromMasterDB on patientInsurance.InsuranceId equals insuranceType.InsuranceId
                into patientInsuranceinsuranceType
                from patientInsurancePlusinsuranceType in patientInsuranceinsuranceType.DefaultIfEmpty()
                join insuranceProvider in insuranceProviderDataFromMasterDB on patientInsurance.InsuranceProviderId equals insuranceProvider.InsuranceProviderId
                into patientInsuranceinsuranceProvider
                from patientInsurancePlusinsuranceProvider in patientInsuranceinsuranceProvider.DefaultIfEmpty()
                select new GetPatientInsuranceDetailByPatientIdViewModel()
                {
                    PatientInsuranceId = patientInsurance.PatientInsuranceId,
                    PatientId = patientInsurance.PatientId,
                    InsuranceId = patientInsurancePlusinsuranceType == null ? 0 : patientInsurancePlusinsuranceType.InsuranceId,
                    InsuranceName = patientInsurancePlusinsuranceType == null ? "NA" : patientInsurancePlusinsuranceType.InsuranceName,
                    InsuranceType = patientInsurancePlusinsuranceType == null ? "NA" : patientInsurancePlusinsuranceType.InsuranceType,
                    InsuranceProviderId = patientInsurancePlusinsuranceProvider == null ? 0 : patientInsurancePlusinsuranceProvider.InsuranceProviderId,
                    ProviderName = patientInsurancePlusinsuranceProvider == null ? "NA" : patientInsurancePlusinsuranceProvider.ProviderName,
                    ProviderCode = patientInsurancePlusinsuranceProvider == null ? "NA" : patientInsurancePlusinsuranceProvider.ProviderCode,
                    GroupNumber = patientInsurance.PrimaryGroupId,
                    PolicyId = patientInsurance.PrimaryPolicyId,
                    SubscriberName = patientInsurance.SubscriberName,
                    SubscriberDOB = patientInsurance.SubscriberDob,
                    ReslationShipToInsured = patientInsurance.RelationshipToInsured.TrimEnd(),
                    InsurancePhoneNumbr = patientInsurance.InsurancePhone,
                    AccidentDate = patientInsurance.AccidentDate,
                    AccidentType = patientInsurance.AccidentType,
                    AccidentState = patientInsurance.AccidentState

                }).FirstOrDefault(f => f.PatientId.Equals(id));
            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Data = result;
            response.Message = "Request Processed";
            return response;
        }
        public async Task<RequestResponse<List<InsuranceTypeLookupViewModel>>> InsuranceTypeLookupAsync()
        {
            var response = new RequestResponse<List<InsuranceTypeLookupViewModel>>();
            var result = await _masterDbContext.TblInsuranceSetups.Select(s => new InsuranceTypeLookupViewModel()
            {
                InsuranceId = s.InsuranceId,
                InsuranceName = s.InsuranceName
            }).OrderBy(o => o.InsuranceName).ToListAsync();

            response.Data = result;
            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed !";
            return response;
        }
        public async Task<RequestResponse<List<InsuranceProviderLookupViewModel>>> InsuranceProviderLookupAsync()
        {
            var response = new RequestResponse<List<InsuranceProviderLookupViewModel>>();
            var result = await _masterDbContext.TblInsuranceProviders.Select(s => new InsuranceProviderLookupViewModel()
            {
                insuranceProviderId = s.InsuranceProviderId,
                ProviderName = s.ProviderName

            }).OrderBy(o => o.ProviderName).ToListAsync();

            response.Data = result;
            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed !";
            return response;
        }
        public async Task<RequestResponse<List<FacilityLookupViewModel>>> FacilityLookup()
        {
            var response = new RequestResponse<List<FacilityLookupViewModel>>();

            var result = await _applicationDbContext.TblFacilities.Select(s => new FacilityLookupViewModel()
            {
                FacilityId = s.FacilityId,
                FacilityName = s.FacilityName

            }).ToListAsync();

            response.Data = result;
            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed !";
            return response;
        }

    }
}
