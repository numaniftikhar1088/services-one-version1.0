using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Identity;
using TrueMed.MasterPortalAppManagement.Domain.Models.Menu.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Models.Menu.Request;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Menu.Interface
{
    public interface IMenuManagement
    {
        Task<bool> DeleteMenuByIdMenuAsync(int id);
        Task<bool> MenuActivationByIdAsync(int id, bool isActive);
        IQueryable<MenuModel> GetAllMenus();
        Task<bool> IsMenuExistsByNameAsync(string name);
        Task<bool> IsMenuNameValidAsync(KeyValuePairViewModel<int?> uniqueKeyValidationViewModel);
        Task<int?> GetMenuIdByNameAsync(string name);
        Task<IdentityResult> SaveOrUpdateMenuAsync(MenuViewModel menuViewModel);
        Task<ICollection<ModuleModel>> GetModulesByIdsAsync(params int[] ids);
    }
}
