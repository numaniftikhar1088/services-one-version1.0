using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblControlType
{
    public int ControlId { get; set; }

    public string ControlName { get; set; }

    public bool? IsVisible { get; set; }

    public int LabId { get; set; }
}
