using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Response;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;
using TrueMed.FacilityManagement.Domain.Models.ResponseModel;

namespace TrueMed.FacilityManagement.Business.Services.Interface
{
    public interface ILabFacInsTypeAssignmentService
    {
        Task<RequestResponse> SaveLabFacInsTypeAssignementAsync(SaveLabFacInsTypeAssignementRequest request);
        Task<DataQueryResponse<List<GetLabFacInsTypeAssignementDetailResponse>>> GetLabFacInsTypeAssignementDetailAsync(DataQueryModel<LabFacInsTypeAssignementQueryModel> query);
        Task<RequestResponse<GetLabFacInsTypeAssignementDetailByIdResponse>> GetLabFacInsTypeAssignementDetailByIdAsync(int id);
        Task<RequestResponse> ChangeLabFacInsTypeAssignementStatusAsync(ChangeLabFacInsTypeAssignementStatusRequest request);
        Task<RequestResponse> DeleteLabFacInsTypeAssignementByIdAsync(int id);
    }
}
