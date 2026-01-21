using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface
{
    public interface IPanelManagement
    {
        IQueryable<PanelModel> GetAllPanels();
        Task<int?> GetPanelIdByNameAsync(string name);
        Task<bool> IsPanelExistsByIdAsync(int id);
        Task<bool> IsPanelExistsByNameAsync(string name);
        Task<bool> IsPanelNameValidAsync(KeyValuePairViewModel<int?> uniqueKeyValidation);
        Task<bool> SaveOrUpdatePanelAsync(Models.Test.Request.PanelViewModel panelSetupView);
        Task<bool> DeletePanelByIdAsync(int panelId);
        Task<bool> PanelActivationByIdAsync(int id, bool isActive);
    }
}
