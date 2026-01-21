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
    public interface IPatientLoginManagement
    {
        Task<RequestResponse> SavePatientLoginAsync(SavePatientLoginViewModel entity);
        Task<DataQueryResponse<List<GetPatientLoginUserDetailViewModel>>> GetPatientLoginDetailAsync(DataQueryModel<PatientLoginUserQueryModel> query);
        Task<RequestResponse<bool>> VerifiedPatientLoginUserPasswordAsync(PatientHashedPasswordVerifiedViewModel entity);
    }
}
