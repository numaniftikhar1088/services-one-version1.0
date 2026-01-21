using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs
{
    public class ModuleSectionsModel
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; } = null!;
        public IEnumerable<int>? SectionIds { get; set; }
    }
}
