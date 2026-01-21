namespace TrueMed.CompendiumManagement.Domain.Models.QueryModel
{
    public class IDCompendiumPanelMappingQM
    {
        public int? PerformingLabId { get; set; }
        public string? PerformingLabName { get; set; }
        public string? PanelName { get; set; }
        public string? PanelCode { get; set; }
        public string? AssayName { get; set; }
        public string? Organism { get; set; }
        public string? TestCode { get; set; }
        public string? ReportingRuleName { get; set; }
        public string? GroupName { get; set; }
        public string? AntibioticClass { get; set; }
        public string? Resistance { get; set; }
    }
}
