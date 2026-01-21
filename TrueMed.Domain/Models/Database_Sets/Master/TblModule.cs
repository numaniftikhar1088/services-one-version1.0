using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblModule
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime? CreateDate { get; set; }

    public string? CreateBy { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? UpdateBy { get; set; }

    public int? OrderId { get; set; }

    public string? Icon { get; set; }

    //public virtual ICollection<TblModuleDeniedControl> TblModuleDeniedControls { get; } = new List<TblModuleDeniedControl>();

    //public virtual ICollection<TblModuleDeniedSection> TblModuleDeniedSections { get; } = new List<TblModuleDeniedSection>();

    public virtual ICollection<TblModuleSection> TblModuleSections { get; } = new List<TblModuleSection>();

    public virtual ICollection<TblPage> Pages { get; } = new List<TblPage>();
    public virtual ICollection<TblApplicationLink> TblApplicationLinks { get; } = new List<TblApplicationLink>();

   
}
