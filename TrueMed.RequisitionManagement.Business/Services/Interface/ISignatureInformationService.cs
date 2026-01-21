using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;

namespace TrueMed.RequisitionManagement.Business.Services.Interface
{
    public interface ISignatureInformationService
    {
        Task<SignatureInformationResponse> SavePatientSignatureInformation(SignatureInformationRequest request);
    }
}
