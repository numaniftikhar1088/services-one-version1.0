using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Request
{
    public class SaveIDCompendiumPanelMappingRequest
    {
        public int Id { get; set; }
        public int PanelId { get; set; }
        public int PerformingLabId { get; set; }
        public string PanelName { get; set; }
        public string PanelCode { get; set; }
        public int AssayNameId { get; set; }
        public string? Organism { get; set; }
        public string? TestCode { get; set; }
        public int ReportingRuleId { get; set; }
        public int GroupNameId { get; set; }
        public string? AntibioticClass { get; set; }
        public bool Resistance { get; set; }
        public int? NumberOfDetected { get; set; }

        public int? NumberOfRepeated { get; set; }
    }
    public class IDCompendiumPanelMappingBulkSaveRequest
    {
        //public int Id { get; set; }
        //public int PanelId { get; set; }
        public string? PerformingLab { get; set; }
        public string? PanelName { get; set; }
        public string? PanelCode { get; set; }
        public string? AssayName { get; set; }
        public string? Organisim { get; set; }
        public string? TestCode { get; set; }
        public string? GroupName { get; set; }
        public string? AntibioticClass { get; set; }
        public string? Resistance { get; set; }
        public string? NumberOfDetected { get; set; }

        public string? NumberOfRepeated { get; set; }

    }
    public class IDCompendiumReportingRulesBulkSaveRequest
    {
        //public int Id { get; set; }
        public string? TestCode { get; set; }
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
