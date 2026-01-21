using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblModuleSection
{
    public int SectionId { get; set; }

    public int ModuleId { get; set; }

    public DateTime? CreateDate { get; set; }

    public string? CreateBy { get; set; }

    public virtual TblSection Section { get; set; } = null!;
}
