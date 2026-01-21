using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Request
{
    public class PanelQueryViewModel
    {
        public string? Name { get; set; }
        public string? TMITCode { get; set; }
        public int? Department { get; set; }
        public int? RequisitionType { get; set; }
        public bool? IsActive { get; set; }
    }
}
