using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblModuleDeniedSection
{
    public int ModuleId { get; set; }

    public int SectionId { get; set; }

    public DateTime CreateDate { get; set; }

    public string CreateBy { get; set; } = null!;

    public virtual TblSection Section { get; set; } = null!;
}
