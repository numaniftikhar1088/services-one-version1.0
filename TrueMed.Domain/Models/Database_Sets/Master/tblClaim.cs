using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblClaim
{
    public int Id { get; set; }

    public int? ParentId { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<TblPageSection> TblPageSections { get; } = new List<TblPageSection>();

    //public virtual ICollection<TblPermission> TblPermissions { get; } = new List<TblPermission>();

    public virtual ICollection<TblPage> Pages { get; } = new List<TblPage>();
}
