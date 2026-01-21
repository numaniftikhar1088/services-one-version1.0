using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblControlType
{
    public int ControlId { get; set; }

    public string ControlName { get; set; } = null!;

    public bool? IsVisible { get; set; }
}
