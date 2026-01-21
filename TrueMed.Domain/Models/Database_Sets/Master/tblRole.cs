using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblRole
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int? ParentId { get; set; }

    public bool? IsVisible { get; set; }

    public int? LabId { get; set; }

    public virtual ICollection<TblUserRole> TblUserRoles { get; } = new List<TblUserRole>();
}
