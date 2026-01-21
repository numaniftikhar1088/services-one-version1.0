using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblPageClaim
{
    public int Id { get; set; }

    public int PageId { get; set; }

    public int ClaimId { get; set; }

    public virtual TblClaim Claim { get; set; }

    public virtual TblPage Page { get; set; }
}
