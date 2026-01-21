using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRole
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int? RoleType { get; set; }

    public DateTime CreateDate { get; set; }

    public string CreateBy { get; set; } = null!;

    public string? UpdateBy { get; set; }

    public DateTime? UpdateDate { get; set; }

    public bool IsDeleted { get; set; }

    public virtual ICollection<TblRoleClaim> TblRoleClaims { get; } = new List<TblRoleClaim>();

    public virtual ICollection<TblUserRole> TblUserRoles { get; } = new List<TblUserRole>();
}
