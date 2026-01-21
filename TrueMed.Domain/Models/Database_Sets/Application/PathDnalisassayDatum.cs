using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class PathDnalisassayDatum
{
    public int AssayId { get; set; }

    public string AssayName { get; set; }

    public string OrganismName { get; set; }

    public string ReportingRule { get; set; }

    public string TestCode { get; set; }

    public string PerformingLabs { get; set; }

    public string IsReportable { get; set; }

    public string OrganismType { get; set; }

    public string IsCritical { get; set; }

    public string ReqType { get; set; }

    public string UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string AthenaCode { get; set; }

    public int? PanelId { get; set; }
}
