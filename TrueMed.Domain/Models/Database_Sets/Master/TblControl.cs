using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblControl
{
    public int Id { get; set; }

    public string ControlKey { get; set; } = null!;

    public string ControlName { get; set; } = null!;
    public int? TypeOfSection { get; set; }
    public int? TypeOfControl { get; set; }

    public string DefaultValue { get; set; }

    public string Options { get; set; }

    public int SortOrder { get; set; }

    public string FormatMask { get; set; }

    public string ColumnValidation { get; set; }

    public bool? IsActive { get; set; }

    public bool IsSystemRequired { get; set; }

    public bool IsSystemControl { get; set; }

    public int? OrderViewSortOrder { get; set; }

    public string OrderViewDisplayType { get; set; }
    public string CssStyle { get; set; }
    public string DisplayType { get; set; }
    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    //public virtual ICollection<TblModuleDeniedControl> TblModuleDeniedControls { get; } = new List<TblModuleDeniedControl>();

    public virtual ICollection<TblSectionControl> TblSectionControls { get; } = new List<TblSectionControl>();
}

