using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class ToxPanel
{
    public int Id { get; set; }

    public string? PanelGroupCode { get; set; }

    public int? PanelGroupId { get; set; }

    public string? PanelName { get; set; }

    public string? PanelDescription { get; set; }

    public string? PanelAbbrevation { get; set; }

    public string? LabReferenceCode { get; set; }

    public string? RequistionType { get; set; }

    public string? PanelType { get; set; }

    public bool? IsMasterPanel { get; set; }

    public bool? IsActive { get; set; }

    public int? LabId { get; set; }

    public int? PortalId { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? Cptcodes { get; set; }

    public int? OrderId { get; set; }

    public string? EdenPanelCode { get; set; }

    public string? PerformingLab { get; set; }

    public string? ReqId { get; set; }

    public string? CompendiumPanelCode { get; set; }

    public string? DrugClass { get; set; }
}
