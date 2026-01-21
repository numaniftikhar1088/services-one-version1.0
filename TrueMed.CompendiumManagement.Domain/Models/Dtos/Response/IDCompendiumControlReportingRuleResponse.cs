using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Response
{
    public class IDCompendiumControlReportingRuleResponse
    {
        public int Id { get; set; }

        public string? QCControlName { get; set; }
        public string? QCControlType { get; set; }
        public string? Pass { get; set; }
        public string? Fail { get; set; }
        public bool? UndeterminedResult { get; set; }
        public List<PanelsRes> Panels { get; set; }

    }
    public class PanelsRes
    {
        public int? PanelId { get; set; }
        public string? PanelName { get; set; }
    }
    public class SaveIDCompendiumControlReportingRulePanels
    {
        public int Id { get; set; }
        public List<PanelsRes> Panels { get; set; }
    }
}
