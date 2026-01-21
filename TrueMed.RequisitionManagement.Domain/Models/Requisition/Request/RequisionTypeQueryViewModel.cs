using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Requisition.Request
{
    public class RequisionTypeQueryViewModel
    {
        public string Name { get; set; } = string.Empty;
        public string? Type { get; set; }
        public bool? IsActive { get; set; }
        public string? RequisitionColor { get; set; }
    }
}
