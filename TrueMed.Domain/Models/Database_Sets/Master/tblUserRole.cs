using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblUserRole
{
    public string UserId { get; set; } = null!;

    public int LabId { get; set; }

    public int RoleId { get; set; }

    public virtual TblLab Lab { get; set; } = null!;

    public virtual TblRole Role { get; set; } = null!;

    public virtual TblUser User { get; set; } = null!;
}
