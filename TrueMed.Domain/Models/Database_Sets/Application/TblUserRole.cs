using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblUserRole
{
    public string UserId { get; set; } = null!;

    public int RoleId { get; set; }

    public int? SubRoleType { get; set; }

    public virtual TblRole Role { get; set; } = null!;
}
