using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class PathDnalispanelMapping
{
    public int PanelId { get; set; }

    public string PerformingLabs { get; set; }

    public string PanelName { get; set; }

    public string PanelCode { get; set; }

    public string Organism { get; set; }

    public string TestCode { get; set; }

    public string GroupId { get; set; }

    public string ReqType { get; set; }

    public string UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public int? DynamicPanelId { get; set; }
}
