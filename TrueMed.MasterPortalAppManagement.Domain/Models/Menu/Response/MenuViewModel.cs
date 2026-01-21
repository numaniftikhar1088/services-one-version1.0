using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Menu.Response
{
    public class MenuViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int Order { get; set; }
        public bool IsVisible { get; set; } = true;
        public int ModuleId { get; set; }
        public string? MenuLink { get; set; }
    }
}
