using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblModuleSection
{
    public int SectionId { get; set; }

    public int ModuleId { get; set; }

    public DateTime? CreateDate { get; set; }

    public string? CreateBy { get; set; }

    public virtual TblModule Module { get; set; } = null!;

    public virtual TblSection Section { get; set; } = null!;
}
