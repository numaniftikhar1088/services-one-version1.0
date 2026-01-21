using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Request
{
    public class TestAssignQueryViewModel
    {
        public string? TestName { get; set; }
        public string? PanelName { get; set; }
        public string? PanelGroupName { get; set; }
        public string? RequisitionTypeName { get; set; }
    }
}
