using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Models.Datatable;

namespace TrueMed.CompendiumManagement.Business.Interface
{
    public interface IIDCompendiumReportingRulesService
    {
        Task<RequestResponse> SaveIDCompendiumReportingRulesAsync(SaveIDCompendiumReportingRulesRequest request);
        Task<DataQueryResponse<List<IDCompendiumReportingRulesDetailedResponse>>> GetIDCompendiumReportingRulesDetailAsync(DataQueryViewModel<IDCompendiumReportingRulesQueryModel> query);
        Task<RequestResponse<List<PanelAndTestResponse>>> GetPanelsAndTestsByIdAsync(int Id);
        byte[] IDCompendiumDataReportingRuleTemplateDownload();
        RequestResponse<FileContentResult> ReportingRulesExportToExcel(int[]? selectedRow);


    }
}
