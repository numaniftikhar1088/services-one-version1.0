using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;

namespace TrueMed.RequisitionManagement.Business.Services.Interface
{
    public interface ISingleRequistionService
    {
        Task<RequestResponse> SaveSingleRequisitionAsync(SaveSingleRequistionRequest request);
        Task<RequestResponse> DeleteSingleRequisitionByIdAsync(int id);
        RequestResponse<List<FacilityLookupForRequsitionResponse>> FacilityLookupForRequisition();
    }
}
