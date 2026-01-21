using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblState
{
    public int Id { get; set; }

    public string? StateCode { get; set; }

    public string? StateName { get; set; }
}
