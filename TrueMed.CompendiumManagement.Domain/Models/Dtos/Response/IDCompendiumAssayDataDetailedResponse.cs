using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Response
{
    public class IDCompendiumAssayDataDetailedResponse
    {
        public int Id { get; set; }
        public string TestName { get; set; }
        public string? TestDisplayName { get; set; }
        public string? TestCode { get; set; }
        public int? ReferenceLabId { get; set; }
        public string? ReferenceLabName { get; set; }
    }
    public class PanelAndReportingRulesResponse
    {
        public int PanelId { get; set; }
        public string? PanelName { get; set; }
        public int RuleId { get; set; }
        public string? RuleName { get; set; }
    }
}
