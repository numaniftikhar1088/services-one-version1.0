using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblPage
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? LinkUrl { get; set; }

    public int? ParentId { get; set; }

    public int? OrderId { get; set; }

    public string? MenuIcon { get; set; }

    public bool? IsVisible { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool? IsActive { get; set; }
    public int? ChildId { get; set; }

    public virtual ICollection<TblPageSection> TblPageSections { get; } = new List<TblPageSection>();

    //public virtual ICollection<TblUserfavouriteMenu> TblUserfavouriteMenus { get; } = new List<TblUserfavouriteMenu>();
    public virtual ICollection<TblApplicationLink> TblApplicationLinks { get; } = new List<TblApplicationLink>();

    public virtual ICollection<TblClaim> Claims { get; } = new List<TblClaim>();

    public virtual ICollection<TblModule> Modules { get; } = new List<TblModule>();
}
