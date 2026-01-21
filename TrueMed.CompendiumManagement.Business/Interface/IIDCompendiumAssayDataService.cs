using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Models.Datatable;

namespace TrueMed.CompendiumManagement.Business.Interface
{
    public interface IIDCompendiumAssayDataService
    {
        Task<RequestResponse> SaveIDCompendiumAssayDataAsync(SaveIDCompendiumAssayDataRequest request);
        Task<DataQueryResponse<List<IDCompendiumAssayDataDetailedResponse>>> GetIDCompendiumAssayDataDetailAsync(DataQueryViewModel<IDCompendiumAssayDataQueryModel> query);
        Task<RequestResponse> DeleteIDCompendiumAssayDataByIdAsync(int id);
        Task<RequestResponse<List<PanelAndReportingRulesResponse>>> GetPanelsAndReportingRulesByIdAsync(int Id);
        Task<RequestResponse<List<ReferenceLabLookup>>> referenceLabLookupAsync();
    }
}
