using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Domain.Models.Response;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Response;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;
using TrueMed.FacilityManagement.Domain.Models.ResponseModel;

namespace TrueMed.FacilityManagement.Business.Services.Interface
{
    public interface IAssignRefLabAndGroupService
    {
        #region Commands
        RequestResponse Add(AddAssignRefLabAndGroupRequest request);
        RequestResponse Edit(EditAssignRefLabAndGroupRequest request);
        RequestResponse DeleteById(int id);
        RequestResponse StatusChanged(StatusChangedAssignRefLabAndGroupRequest request); 
        #endregion
        #region Queries
        //DataQueryResponse<List<AssignReferenceLabAndGroupResponse>> GetAll(DataQueryModel<AssignReferenceLabAndGroupQueryModel> query);
        Task<RequestResponse<List<AssignReferenceLabAndGroupResponse>>> GetById(int id);
        #endregion
        #region Lookups
        Task<List<dynamic>> ReferenceLab_Lookup(int labId);
        Task<List<CommonLookupResponse>> RequisitionType_Lookup();
        Task<List<CommonLookupResponse>> TestGroup_Lookup();
        #endregion
    }
}
