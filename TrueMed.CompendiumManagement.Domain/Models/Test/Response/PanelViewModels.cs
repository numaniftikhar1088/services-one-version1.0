using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Response
{
    public class PanelViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? RequisitionType { get; set; }
        public string? RequisitionTypeName { get; set; }
        public string? Department { get; set; }
        public string? TmitCode { get; set; }
        public string DepartmentName { get; set; }
        public bool? IsActive { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateBy { get; set; } = string.Empty;
    }
}
