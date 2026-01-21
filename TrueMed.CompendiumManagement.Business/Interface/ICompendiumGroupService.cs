using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;

namespace TrueMed.CompendiumManagement.Business.Interface
{
    public interface ICompendiumGroupService
    {
        // Task<bool> DeletePanelGroupByIdAsync(int id);
        //  IQueryable<PanelGroupModel> GetAllPanelGroups();
        IQueryable<CompendiumGroupViewModel> GetCompendiumGroups();
        //Task<int?> GetPanelGroupIdByNameAsync(string name);
        //Task<bool> IsPanelGroupExistsByIdAsync(int id);
        //Task<bool> IsPanelGroupExistsByNameAsync(string name);
        //Task<bool> IsPanelGroupNameValidAsync(UniqueKeyValidationViewModel uniqueKeyValidation);
        //Task<bool> PanelGroupActivationByIdAsync(int id, bool isActive);
        Task<bool> SaveGroupAsync(CompendiumGroupViewModel viewModel);
    }
}
