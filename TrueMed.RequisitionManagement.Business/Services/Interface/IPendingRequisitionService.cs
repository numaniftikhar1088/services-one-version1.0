using Microsoft.AspNetCore.Mvc;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;

namespace TrueMed.RequisitionManagement.Business.Services.Interface
{
    public interface IPendingRequisitionService
    {
        DataQueryResponse<List<IncompleteRequisitionResponse>> IncompleteRequisition(DataQueryModel<IncompleteRequisitionQM> query);
        DataQueryResponse<List<WaitingForSignatureResponse>> WaitingForSignature(DataQueryModel<WaitingForSignatureQM> query);
        dynamic Physician_Lookup();
        RequestResponse Delete(int id);
        RequestResponse WaitingForSignatureSave(WaitingForSignatureSaveRequest request);
        RequestResponse<FileContentResult> IncompleteRequisitionExportToExcel(int[]? selectedRow);
    }
}
