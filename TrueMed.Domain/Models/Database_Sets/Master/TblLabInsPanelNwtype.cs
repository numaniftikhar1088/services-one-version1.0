using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblLabInsPanelNwtype
{
    public int Lipntid { get; set; }

    public int? PanelId { get; set; }

    public int? InsuranceId { get; set; }

    public int? NetworkTypeId { get; set; }

    public int? LabId { get; set; }

    public int? LabType { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool IsDeleted { get; set; }
}
