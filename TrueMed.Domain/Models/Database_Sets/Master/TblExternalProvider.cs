using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblExternalProvider
{
    public string UserId { get; set; } = null!;

    public string Provider { get; set; } = null!;

    public DateTime? CreateDate { get; set; }

    public virtual TblUser User { get; set; } = null!;
}
