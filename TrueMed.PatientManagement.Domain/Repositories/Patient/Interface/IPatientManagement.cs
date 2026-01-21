using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.PatientManagement.Domain.Models;
using TrueMed.PatientManagement.Domain.Models.Patient.Request;
using TrueMed.PatientManagement.Domain.Models.Patient.Request.QueryModel;
using TrueMed.PatientManagement.Domain.Models.Patient.Request.QueryModel.Base;
using TrueMed.PatientManagement.Domain.Models.Patient.Response;
using TrueMed.PatientManagement.Domain.Models.Patient.Response.QueryModel;
using TrueMed.PatientManagement.Domain.Models.Patient.Response.QueryModel.Base;

namespace TrueMed.PatientManagement.Domain.Repositories.Patient.Interface
{
    public interface IPatientManagement
    {
        Task<bool> AddOrUpdatePatientAddressAsync(int patientId, PatientAddressInfoViewModel addressInfoViewModel);
        
        Task<bool> AddOrUpdatePatientAsync(Domain.Models.Patient.Request.PatientViewModel patientViewModel);

        Task<int?> IsPatientExistsByNameAndDateOfBirthAsync(PatientValidationByNameAndDateOfBirthViewModel model);

        Task<bool> DeletePatientAsync(int patientId);
        
        IQueryable<PatientDetailsVM> GetAllPatients();
        Task<DataQueryResponseModel<List<SearchPatientResponseVM>>> SearchPatient(DataQueryRequestModel<SearchPatientRequestQM> request);

        Task<bool> IsPatientExistsByIdAsync(int patientId);

        Task<bool> IsPatientFacilityExistsByIdAsync(int facilityId);


        //#region Search
        //Task<DataQueryResponseModel<List<SearchPatientResponseVM>>> SearchPatient(DataQueryRequestModel<SearchPatientRequestQM> request);
        //#endregion
    }
}
