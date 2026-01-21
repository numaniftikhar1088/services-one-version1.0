using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.LISManagement.Domains.DTOS.Response
{
    public class IDResultDataExpandResponse
    {
        public List<Control>? Controls { get; set; } = new List<Control>();
        public List<Pathogen>? Pathogens { get; set; } = new List<Pathogen> { };
        public ConfigurationSettings Configs { get; set; } = new ConfigurationSettings();
        
    }
    public class Control
    {
        public int Id { get; set; }
        public string? ControlName { get; set; }
        public string? Results { get; set; }
        public string? CombinedResult { get; set; }
        public string? CTValue { get; set; }
        public decimal? AmpScore { get; set; }
        public decimal? CrtSD { get; set; }
        public decimal? CqConf { get; set; }
        public bool? IsReRun { get; set; }
    }
    public class Pathogen
    {
        public string? PanelName { get; set; }
        public List<OrganismResistance> Organisms { get; set; } = new List<OrganismResistance> { };
        public List<OrganismResistance>? Resistance { get; set; } = new List<OrganismResistance> { };
    }
    public class OrganismResistance
    {
        public int? Id { get; set; } 
        public string? Organism { get; set; }
        public string? OrganismType { get; set; }
        public string? Results { get; set; }
        public string? CombinedResult { get; set; }
        public int? RepetitionNo { get; set; }
        public string? CTValue { get; set; }
        public decimal? AmpScore { get; set; }
        public decimal? CrtSD { get; set; }
        public decimal? CqConf { get; set; }
        public bool? IsReRun { get; set; }
        public string? Comments { get; set; }
        public string PanelName { get; set; }
    }
    public class ConfigurationSettings
    {
        public bool? CalculationOnCt { get; set; }
        public bool? CalculationOnAmpScore { get; set; }
        public bool? CalculationOnCqConf { get; set; }
    }
    public class ChangeControlsStatusRequest
    {
        public string Status { get; set; }
        public List<Control>? Controls { get; set; } = new List<Control>() { };
    }
    public class ChangeOrganismStatusRequest
    {
        public string Status { get; set; }
        public Pathogen Pathogens { get; set; }
    }
}
