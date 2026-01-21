using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabSectionControl
{
    public int Id { get; set; }

    public int? LabId { get; set; }

    public int? PageId { get; set; }

    public int? SectionId { get; set; }

    public int? ControlId { get; set; }

    public string ControlKey { get; set; } = null!;

    public string ControlName { get; set; } = null!;

    public string TypeOfControl { get; set; } = null!;

    public string? DefaultValue { get; set; }

    public string? Options { get; set; }

    public int SortOrder { get; set; }

    public string? FormatMask { get; set; }

    public string? ColumnValidation { get; set; }

    public bool? IsVisible { get; set; }

    public bool IsSystemRequired { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? TypeOfSection { get; set; }

    public string? CssStyle { get; set; }

    public string? DisplayType { get; set; }

    public string? ControlValue { get; set; }

    public string? ControlData { get; set; }

    public int? OrderViewSortOrder { get; set; }

    public string? OrderViewDisplayType { get; set; }
}
