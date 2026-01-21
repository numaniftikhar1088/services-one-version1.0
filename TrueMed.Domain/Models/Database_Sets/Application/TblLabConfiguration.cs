using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabConfiguration
{
    public int Id { get; set; }

    public int? PageId { get; set; }

    public int? SectionId { get; set; }

    public int? LabId { get; set; }

    public int? ControlId { get; set; }

    public bool? IsSelected { get; set; }

    public string? DisplayFieldName { get; set; }

    public bool? Required { get; set; }

    public bool? Visible { get; set; }

    public string? CssStyle { get; set; }

    public string? DisplayType { get; set; }
}
