using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel
{
    public class PanelSetupQueryModel
    {
        public int Id { get; set; }
        public string? PanelName { get; set; }
        public string? Tmitcode { get; set; }
        public string? RequisitionType { get; set; }
        public bool? IsActive { get; set; }
        public int? NetworkType { get; set; }
        //public string? DepartmentName { get; set; }
    }
}
