using TrueMed.Domain.Models.Response;
using TrueMed.ReportingServer.Domain.Dtos.Request;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business.Services.Interfaces
{
    public interface IIDLISReportService
    {
        Task<RequestResponse<string>> GeneratePDFReportAsync(IDLISReportRequest request);
        RequestResponse BulkPublishAndValidate(IDLISResultDataValidateRequest[] request);
        Task<RequestResponse<string>> PrintSelectedReports(int[]? ids);
    }
}
