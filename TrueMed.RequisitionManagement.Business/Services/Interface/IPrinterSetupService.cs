using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;

namespace TrueMed.RequisitionManagement.Business.Services.Interface
{
    public interface IPrinterSetupService
    {
        DataQueryResponse<List<PrinterSetupResponse>> GetPrinters(DataQueryModel<PrinterSetupQueryModel> query);
        Task<RequestResponse> DeleteById(int id);
        Task<RequestResponse> SavePrinterSetupAsync(PrinterSetupRequest request);
    }
}
