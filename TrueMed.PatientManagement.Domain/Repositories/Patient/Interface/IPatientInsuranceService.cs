using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.PatientManagement.Domain.Models.Patient.Request;
using TrueMed.PatientManagement.Domain.Models.Patient.Response;
using TrueMed.PatientManagement.Domain.QueryModel;
using TrueMed.PatientManagement.Domain.QueryModel.Base;
using TrueMed.PatientManagement.Domain.ResponseModel;

namespace TrueMed.PatientManagement.Domain.Repositories.Patient.Interface
{
    public interface IPatientInsuranceService
    {
        Task<RequestResponse> SavePatientInsuranceAsync(SavePatientInsuranceViewModel entity);
        Task<DataQueryResponse<List<GetPatientInsuranceDetailViewModel>>> GetPatientInsuranceDetailAsync(DataQueryModel<PatientInsuranceQueryModel> query);
        Task<RequestResponse<GetPatientInsuranceDetailByPatientIdViewModel>> GetPatientInsuranceDetailByPatientIdAsync(int id);
        Task<RequestResponse<List<InsuranceTypeLookupViewModel>>> InsuranceTypeLookupAsync();
        Task<RequestResponse<List<InsuranceProviderLookupViewModel>>> InsuranceProviderLookupAsync();
        Task<RequestResponse<List<FacilityLookupViewModel>>> FacilityLookup();
    }
}
