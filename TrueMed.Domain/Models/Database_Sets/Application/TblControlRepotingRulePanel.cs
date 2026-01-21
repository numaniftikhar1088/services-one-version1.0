using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblControlRepotingRulePanel
{
    public int Id { get; set; }

    public int? ControlReportingRuleId { get; set; }

    public int? PanelId { get; set; }

    public string? PanelName { get; set; }
}
