namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Response
{
    public class IDCompendiumPanelMappingResponse
    {
        public class GetAll
        {
            //public GetAll()
            //{
            //    ReportingRuleInfos = new List<ReportingRuleInfo>();
            //}
            public int Id { get; set; }
            public int? PanelId { get; set; }
            public int? PerformingLabId { get; set; }
            public string? PerformingLabName { get; set; }
            public string? PanelName { get; set; }
            public string? PanelCode { get; set; }
            public int AssayNameId { get; set; }
            public string? AssayName { get; set; }
            public string? Organism { get; set; }
            public string? TestCode { get; set; }
            public int? ReportingRuleId { get; set; }
            public string? ReportingRuleName { get; set; }
            public int? GroupNameId { get; set; }
            public string? GroupName { get; set; }

            public string? AntibioticClass { get; set; }
            public bool? Resistance { get; set; }
            public int? NumberOfDetected { get; set; }

            public int? NumberOfRepeated { get; set; }
            public List<ReportingRuleInfo> ReportingRuleInfos { get; set; }


        }
        public class GetById
        {
            public GetById()
            {
                ReportingRuleInfos = new List<ReportingRuleInfo>();
            }
            public int? Id { get; set; }
            public int? PerformingLabId { get; set; }
            public string? PanelName { get; set; }
            public string? PanelCode { get; set; }
            public int AssayNameId { get; set; }
            public string? Organism { get; set; }
            public string? TestCode { get; set; }
            public int ReportingRuleId { get; set; }
            public string? GroupNameId { get; set; }
            public string? AntibioticClass { get; set; }
            public bool? Resistance { get; set; }
            public int? NumberOfDetected { get; set; }

            public int? NumberOfRepeated { get; set; }
            public List<ReportingRuleInfo> ReportingRuleInfos { get; set; }


        }
        public class ReportingRuleInfo
        {
            public string? ReportingRuleName { get; set; }
            public string? AgeRange { get; set; }
            public string? Negative { get; set; }
            public string? Low { get; set; }
            public string? Medium { get; set; }
            public string? High { get; set; }
            public string? CriticalHigh { get; set; }
            public decimal? AmpScore { get; set; }
            public decimal? CqConf { get; set; }
        }
    }
   
}
