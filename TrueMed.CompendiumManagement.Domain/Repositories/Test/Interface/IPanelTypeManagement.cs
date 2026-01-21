using System;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface
{
    public interface IPanelTypeManagement
    {
        IQueryable<PanelTypeModel> GetAllPanelTypes();
        Task<int?> GetPanelTypeIdByNameAsync(string name);
        Task<bool> IsPanelTypeExistsByIdAsync(int id);
        Task<bool> IsPanelTypeExistsByNameAsync(string name);
        Task<bool> IsPanelTypeNameValidAsync(KeyValuePairViewModel<int?> uniqueKeyValidation);
        Task<bool> SaveOrUpdatePanelTypeAsync(Models.Test.Request.PanelTypeViewModel PanelTypeSetupView);
        Task<bool> DeletePanelTypeByIdAsync(int PanelTypeId);
        Task<bool> PanelTypeActivationByIdAsync(int id, bool isActive);
    }
}
