using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.QueryModel
{
    public class PanelSetupQueryModel
    {
        public string? PanelName { get; set; }
        public string? Tmitcode { get; set; }
        public int? ReqTypeId { get; set; }
        //public string? ReqType { get; set; }
        public bool? IsActive { get; set; }
        //public string? DepartmentName { get; set; }
        public int? DeptId { get; set; }
    }
}
