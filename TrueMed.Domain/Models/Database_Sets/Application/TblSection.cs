using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblSection
{
    public int Id { get; set; }

    public string? SectionName { get; set; }

    public int? ParentId { get; set; }

    public int? Order { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual ICollection<TblModuleDeniedSection> TblModuleDeniedSections { get; } = new List<TblModuleDeniedSection>();

    public virtual ICollection<TblModuleSection> TblModuleSections { get; } = new List<TblModuleSection>();

    public virtual ICollection<TblSectionControl> TblSectionControls { get; } = new List<TblSectionControl>();
}
