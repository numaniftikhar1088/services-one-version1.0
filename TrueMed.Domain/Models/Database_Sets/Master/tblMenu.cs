using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblMenu
{
    public int MenuId { get; set; }

    public string MenuName { get; set; }

    public string? MenuLink { get; set; }

    public int? ParentId { get; set; }

    public int? OrderId { get; set; }

    public int? ClaimId { get; set; }

    public string? MenuIcon { get; set; }

    public bool? IsVisible { get; set; }

    public bool? IsHeader { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual TblClaim? Claim { get; set; }

    //public virtual ICollection<TblUserfavouriteMenu> TblUserfavouriteMenus { get; } = new List<TblUserfavouriteMenu>();
    public bool? IsActive { get; set; }
}
