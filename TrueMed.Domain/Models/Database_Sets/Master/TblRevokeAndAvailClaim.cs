using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblRevokeAndAvailClaim
{
    public string ObjectId { get; set; } = null!;

    public int Type { get; set; }

    public int ClaimId { get; set; }

    public bool IsAllowed { get; set; }

    public int LabId { get; set; }

    public DateTime CreateDate { get; set; }

    public virtual TblClaim Claim { get; set; } = null!;
}
