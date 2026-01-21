using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Response
{
    public class ModuleViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int Order { get; set; }
        public string? Icon { get; set; }
        public ICollection<LabMenuViewModel>? Childs { get; set; }
        public DateTime? CreateDate { get; set; }
        public string CreateBy { get; set; }
        public bool IsSelelcted { get; set; }
    }

    public class LabMenuViewModel
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Name { get; set; } = null!;
        public int ModuleId { get; set; }
        public bool IsSelelcted { get; set; }
        public IEnumerable<LabMenuViewModel> Menus { get; set; }
    }
}
