using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabControlOptionDependency
{
    public int Id { get; set; }

    public int? LabId { get; set; }

    public int? ControlId { get; set; }

    public int? OptionId { get; set; }

    public int? DependentControlId { get; set; }

    public string DependencyAction { get; set; } = null!;

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
}
