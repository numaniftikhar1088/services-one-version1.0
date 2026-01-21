using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class DynamicPanelsAssignment
{
    public int Id { get; set; }

    public int? PanelId { get; set; }

    public string? PanelName { get; set; }

    public int? AssayId { get; set; }

    public string? TestName { get; set; }

    public string? TestCode { get; set; }

    public bool? IsSpecimen { get; set; }

    public string? PerformingLabs { get; set; }

    public string? GroupId { get; set; }

    public string? PanelCode { get; set; }

    public string? MainPanelName { get; set; }

    public int? MainPanelId { get; set; }

    public string? ReqType { get; set; }

    public bool? IsResistance { get; set; }

    public string? ResistanceClass { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? TempCol { get; set; }

    public string? AssayName { get; set; }

    public string? ReportingRule { get; set; }

    public bool? IsFungal { get; set; }

    public bool? IsBacterial { get; set; }

    public bool? IsAddOnOption { get; set; }

    public string? IsViral { get; set; }
}
