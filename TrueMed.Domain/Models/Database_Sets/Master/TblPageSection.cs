using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

//public partial class TblPageSection
//{
//    public int PageId { get; set; }

//    public int SectionId { get; set; }

//    public int? ClaimId { get; set; }

//    public virtual TblClaim? Claim { get; set; }

//    public virtual TblPage Page { get; set; } = null!;

//    public virtual TblSection Section { get; set; } = null!;
//}
public partial class TblPageSection
{
    public int PageId { get; set; }

    public int SectionId { get; set; }

    public int? ClaimId { get; set; }

    public int IsReqSection { get; set; }

    public string? CustomScript { get; set; }

    public int? SortOrder { get; set; }

    public string? DisplayType { get; set; }

    public virtual TblClaim? Claim { get; set; }

    public virtual TblPage Page { get; set; } = null!;

    public virtual TblSection Section { get; set; } = null!;
}
