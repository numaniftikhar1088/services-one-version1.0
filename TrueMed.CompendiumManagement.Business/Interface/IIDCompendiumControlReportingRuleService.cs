using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Models.Datatable;

namespace TrueMed.CompendiumManagement.Business.Interface
{
    public interface IIDCompendiumControlReportingRuleService
    {
        Task<RequestResponse> SaveIDCompendiumControlReportingRulesAsync(IDCompendiumControlReportingRuleResponse request);

        Task<DataQueryResponse<List<IDCompendiumControlReportingRuleResponse>>> GetIDCompendiumControlReportingRulesAsync(DataQueryViewModel<IDCompendiumControlReportingRulesQueryModel> query);
        Task<RequestResponse> SaveIDCompendiumControlReportingRulePanels(SaveIDCompendiumControlReportingRulePanels request);
    }
}
