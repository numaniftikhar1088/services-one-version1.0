using Microsoft.AspNetCore.Mvc;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.Domain.Models.Datatable;
using TrueMed.InsuranceManagement.Domains.Dtos;
using static TrueMed.CompendiumManagement.Domain.Models.Dtos.Response.IDCompendiumPanelMappingResponse;

namespace TrueMed.CompendiumManagement.Business.Interface
{
    public interface IIDCompendiumPanelMappingService
    {
        #region Queries
        DataQueryResponse<List<IDCompendiumPanelMappingResponse.GetAll>> GetAll(DataQueryViewModel<IDCompendiumPanelMappingQM> query);
        Task<RequestResponse<List<ReportingRuleInfo>>> GetById(int id);
        Task<RequestResponse> SavePanelMapping(SaveIDCompendiumPanelMappingRequest request);
        Task<RequestResponse<List<AssayDataLookup>>> assayDataLookupAsync();
        Task<RequestResponse<List<ReportingRulesLookup>>> ReportingRulesLookupAsync();
        Task<RequestResponse<List<ReferenceLabLookupDto>>> ReferenceLabLookupAsync();
        #endregion

        RequestResponse<FileContentResult> PanelExportToExcel(int[]? selectedRow);
        RequestResponse BulkPanelMappingUpload(FileDataRequest request);
    }
}
