using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Response
{
    public class IDCompendiumReportingRulesDetailedResponse
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? AgeRange { get; set; }
        public string? Negative { get; set; }

        public string? Low { get; set; }
        public string? Medium { get; set; }
        public string? high { get; set; }
        public string? Criticalhigh { get; set; }
        public decimal? AmpScore { get; set; }

        public decimal? CqConf { get; set; }
    }
    public class PanelAndTestResponse
    {
        public int PanelId { get; set; }
        public string? PanelName { get; set; }
        public int TestId { get; set; }
        public string? TestName { get; set; }
    }
    public class ReportingRulesExportToExcelResponse
    {
        public int Id { get; set; }
        public string? ReportingRuleName { get; set; }
        public int? AgeFrom { get; set; }
        public int? AgeTo { get; set; }
        public string? Negative { get; set; }
        public decimal? MinLow { get; set; }
        public decimal? MaxLow { get; set; }
        public decimal? MinInter { get; set; }
        public decimal? MaxInter { get; set; }
        public decimal? MinHigh { get; set; }
        public decimal? MaxHigh { get; set; }
        public decimal? MinCriticalHigh { get; set; }
        public decimal? MaxCriticalHigh { get; set; }
        public decimal? AmpScore { get; set; }
        public decimal? CqConf { get; set; }
    }
}
