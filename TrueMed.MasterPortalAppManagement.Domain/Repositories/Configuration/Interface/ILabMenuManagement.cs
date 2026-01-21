using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface
{
    public interface ILabMenuManagement
    {
        IQueryable<LabMenuModel> GetAllMenus();
        Task<bool> UpdateMenusAsync(int[] menus);
    }
}
