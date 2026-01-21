using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabSectionsControl
{
    public int Id { get; set; }

    public int LabId { get; set; }

    public int ControlId { get; set; }

    public string DisplayName { get; set; } = null!;

    public bool? IsRequired { get; set; }

    public string? CssClass { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdateBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
