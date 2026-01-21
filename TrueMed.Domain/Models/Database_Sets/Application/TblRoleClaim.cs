using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRoleClaim
{
    public int RoleId { get; set; }

    public int ClaimId { get; set; }

    public int? ModuleId { get; set; }

    public string? PagePermissions { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual TblRole Role { get; set; } = null!;
}
