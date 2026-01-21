using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblModuleDeniedSection
{
    public int ModuleId { get; set; }

    public int SectionId { get; set; }

    public DateTime CreateDate { get; set; }

    public string CreateBy { get; set; } = null!;

    public virtual TblModule Module { get; set; } = null!;

    public virtual TblSection Section { get; set; } = null!;
}
