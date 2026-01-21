
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.CompendiumManagement.Domain.Models.Test.Response;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface
{
    public interface IPanelGroupManagement
    {
        Task<bool> DeletePanelGroupByIdAsync(int id);
        //IQueryable<PanelGroupModel> GetAllPanelGroups();
        IQueryable<PanelGroupModel> GetAllCompendiumGroups();
        Task<int?> GetPanelGroupIdByNameAsync(string name);
        Task<bool> IsPanelGroupExistsByIdAsync(int id);
        Task<bool> IsPanelGroupExistsByNameAsync(string name);
        Task<bool> IsPanelGroupNameValidAsync(KeyValuePairViewModel<int?> uniqueKeyValidation);
        Task<bool> PanelGroupActivationByIdAsync(int id, bool isActive);
        Task<bool> SaveOrUpdatePanelGroupAsync(Models.Test.Request.PanelGroupViewModel panelGroupSetupView);
        Task<DataQueryResponse<List<PanelGroupViewModelResp>>> SearchCompendiumGroupAsync(DataQueryViewModel<PanelGroupQueryViewModel> queryModel);
    }
}
