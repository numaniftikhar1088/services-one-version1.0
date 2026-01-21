using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request
{
    public class SaveMenuRequest
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? LinkUrl { get; set; }

        public int? ParentId { get; set; }

        public int? OrderId { get; set; }

        public string? MenuIcon { get; set; }

        public bool? IsVisible { get; set; }
        public int ModuleId { get; set; }
    }
}
