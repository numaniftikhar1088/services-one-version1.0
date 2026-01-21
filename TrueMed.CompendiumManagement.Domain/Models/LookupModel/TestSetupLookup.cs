using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.LookupModel
{
    public class TestSetupLookup
    {
        public int TestId { get; set; }
        public string? TestName { get; set; }
    }
    public class RequisitionTypeLookup
    {
        public int ReqTypeId { get; set; }
        public string? RequisitionTypeName { get; set; } 
    }
    public class CompendiumGroupLookup
    {
        public int Id { get; set; }
        public string? Name { get; set; }

    }
    public class PanelLookupModel
    {
        public int PanelId { get; set; }
        public string? PanelDisplayName { get; set; }
    }
    public class SpecimenTypeLookupModel
    {
        public int? SpecimenTypeId { get; set; }
        public string? SpecimenType { get; set; }
    }
}
