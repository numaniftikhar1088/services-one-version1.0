using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblModuleDeniedControl
{
    public int ModuleId { get; set; }

    public int ControlId { get; set; }

    public DateTime CreateDate { get; set; }

    public string CreateBy { get; set; } = null!;

    public virtual TblControl Control { get; set; } = null!;
}
