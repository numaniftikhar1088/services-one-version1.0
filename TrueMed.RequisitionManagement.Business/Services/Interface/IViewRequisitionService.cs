using Microsoft.AspNetCore.Mvc;
using TrueMed.Domain.Models.Datatable;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;

namespace TrueMed.RequisitionManagement.Business.Services.Interface
{
    public interface IViewRequisitionService
    {
        #region Queries
        DataQueryResponse<List<ViewRequisitionResponse>> ViewRequisition(DynamicDataGridRequest<DynamicDataFilter> query);
        #endregion
        #region Commands
        RequestResponse StatusChanged(ViewRequisitionStatusChangedRequest request);
        RequestResponse RemoveViewRequisition(int id);
        #endregion
        RequestResponse NextStepButton(updateNextStepStatus request);
        RequestResponse<FileContentResult> ViewRequisitionExportToExcel(ViewRequisitionExportToExcel request);
        RequestResponse<FileContentResult> ViewRequisitionExportToExcelV2(DynamicDataGridRequest<DynamicDataFilter> request);
        RequestResponse Restore(int id);
        RequestResponse GetPrintersInfo();
        Task<RequestResponse> UploadFile(ViewRequisitionUploadFileRequest request);

        RequestResponse<List<ViewRequisitionColumnsResponse>> GetColumns();
        RequestResponse SaveColumns(List<ViewRequisitionColumnsResponse> request);
        RequestResponse GetTabsConfiguration(int PageId);
    }
}
