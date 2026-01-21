using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response
{
    public class GetMenuResponse
    {
        public int? MenuId { get; set; }
        public string? MenuName { get; set; }
        public int? DisplayOrder { get; set; }
        public int? ModuleId { get; set; }
        public string? ModuleName { get; set; }
        public bool? IsVisible { get; set; }
        public bool? IsActive { get; set; }
        public string? LinkUrl { get; set; }
        public string? MenuIcon { get; set; }
        public int? ChildId { get; set; }
    }
}
