using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Menu.DTOs
{
    public class ModuleModel
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; } = string.Empty;
        public int? Order { get; set; }
        public string? Icon { get; set; }
    }
    public class ModuleWithMenus: ModuleModel
    {
        public IEnumerable<MenuModel> Menus { get; set; }
    }
    public class MenuModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string MenuLink { get; set; } = null!;
        public int Order { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? CreateBy { get; set; }
        public int? ParentId { get; set; }
        public int ModuleId { get; set; }
        public IEnumerable<ClaimModel>? Claims { get; set; }
        public IEnumerable<MenuModel>? Menus { get; set; }
        public object Icon { get; set; }
    }

    public class ClaimModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
}
