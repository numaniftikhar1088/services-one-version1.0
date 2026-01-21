using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Response;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;
using TrueMed.FacilityManagement.Domain.Models.ResponseModel;

namespace TrueMed.FacilityManagement.Business.Services.Interface
{
    public interface IFacilityOptionsService
    {
        Task<DataQueryResponse<List<FacilityOptionsResponse>>> GetAllFacilityOptions(DataQueryModel<FacilityOptionsQueryModel> query);
        Task<RequestResponse> SaveFacilityOption(List<SaveFacilityOptionsRequest> request);
        Task<RequestResponse> SaveFacilitiesAsync(SaveFacilities request);

    }
}
