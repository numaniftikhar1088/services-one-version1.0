using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblPermission
{
    public int? ClaimId { get; set; }

    public string? Name { get; set; }

    public int Id { get; set; }

    public virtual TblClaim? Claim { get; set; }
}
