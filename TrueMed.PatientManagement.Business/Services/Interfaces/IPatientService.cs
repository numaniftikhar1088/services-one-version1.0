using TrueMed.Domain.Models.Response;
using TrueMed.PatientManagement.Domain.Models.Dtos.Request;
using TrueMed.PatientManagement.Domain.Models.Dtos.Response;
using TrueMed.PatientManagement.Domain.Models.QueryModels.Request;
using TrueMed.PatientManagement.Domain.Models.QueryModels.Response;
using TrueMed.PatientManagement.Domain.Models.Response.Request.Base;
using TrueMed.PatientManagement.Domain.Models.Response.Response.Base;

namespace TrueMed.PatientManagement.Business.Services.Interfaces
{
    public interface IPatientService
    {
        #region Commands
        RequestResponse Save(SavePatientRequest request);
        RequestResponse Delete(int id);
        #endregion
        #region Querires
        DataQueryResponse<List<PatientResponseQM>> GetAll(DataQueryRequest<PatientRequestQM> query);
        RequestResponse<PatientByIdResponse> GetById(int id);
        DataQueryResponse<List<PatientResponseByFNameLnameAndDateOfBirthQM>> GetPatientByFNameLNameAndDateOfBirthAndFacilityId(PatientByFNameLnameAndDateOfBirthQM query);
        Task<RequestResponse<List<GetPatientsByFNameLNameResponse>>> GetPatientByFNameLNameWithInsuranceDetailAsync(PatientSearchByFNameLNameRequest request);
        #endregion
        #region Lookups
        #endregion
    }
}
