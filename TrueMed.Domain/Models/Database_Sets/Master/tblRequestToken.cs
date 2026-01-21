using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblRequestToken
{
    public string UserId { get; set; } = null!;

    public string Token { get; set; } = null!;

    public DateTime CreateDate { get; set; }

    public int Type { get; set; }

    public DateTime? ExpireyDate { get; set; }

    public bool? IsValid { get; set; }
}
