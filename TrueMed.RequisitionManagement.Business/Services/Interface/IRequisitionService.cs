using TrueMed.Domain.Models.LookUps;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;
using static TrueMed.RequisitionManagement.Domain.Models.Dtos.Response.RequisitionResponse;

namespace TrueMed.RequisitionManagement.Business.Services.Interface
{
    public interface IRequisitionService
    { 
       
        SectionPlusControlsWithValue GetControlsWithValueByReqIdForEdit(int reqId);
        RequestResponse AddNewProvider(RequisitionRequest.AddNewProvider request);
        //DataQueryResponse<List<GetRequisitionResponse>> GetRequisitionDetails(DataQueryModel<RequisitionQM> query);
        List<TrueMed.Domain.Models.Database_Sets.Application.TblFacility> GlobalFilterTest();
        RequestResponse<SaveRequisitionResponse> SubmitRequisition(SaveRequisitionRequest request);

    }
}
