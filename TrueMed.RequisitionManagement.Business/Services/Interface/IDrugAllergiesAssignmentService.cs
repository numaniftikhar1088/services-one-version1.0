using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.LookUps;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Domain.Models.Response;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;

namespace TrueMed.RequisitionManagement.Business.Services.Interface
{
    public interface IDrugAllergiesAssignmentService
    {
        #region Commands
        TrueMed.Domain.Models.Response.RequestResponse<int> Save(DrugAllergiesAssignmentRequest.SaveRequest request);
        TrueMed.Domain.Models.Response.RequestResponse StatusChanged(DrugAllergiesAssignmentRequest.StatusChangedRequest request);
        TrueMed.Domain.Models.Response.RequestResponse Delete(int id);

        #endregion
        #region Queries
        DataQueryResponse<List<DrugAllergiesAssignmentResponse.GetAllResponse>> GetAll(DataQueryModel<DrugAllergiesAssignmentQM> query);
        TrueMed.Domain.Models.Response.RequestResponse<DrugAllergiesAssignmentResponse.GetByIdResponse> GetById(int id);

        #endregion

        #region Lookups
        Task<List<dynamic>> DrugAllergiesCode_Lookup(string? description);
        Task<List<CommonLookupResponse>> RequisitionType_Lookup();
        Task<List<CommonLookupResponse>> GetOnlyReferenceLab_Lookup();
        Task<List<FacilityLookupResponse>> Facility_Lookup();
        Task<List<CommonLookupResponse>> Master_CompendiumPanel_Lookup();
        #endregion'


    }
}
