using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.LookupModel
{
    public class AssayDataLookup
    {
        public int AssayNameId { get; set; }
        public string? AssayName { get; set; }
        public string? Organism { get; set; }
        public string? TestCode { get; set; }
    }
    public class ReportingRulesLookup
    {
        public int ReportingRuleId { get; set; }
        public string? ReportingRuleName { get; set; }
    }
    public class GroupLookup
    {
        public int GroupNameId { get; set; }
        public string GroupName { get; set; }
    }
}
