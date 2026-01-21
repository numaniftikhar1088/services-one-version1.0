using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblRefLabAssignment
{
    public int RefLabId { get; set; }

    public int LabId { get; set; }

    public int LabType { get; set; }

    public DateTime CreateDate { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime? UpdateDate { get; set; }

    public string? UpdateBy { get; set; }

    public int? Status { get; set; }
}
