using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblControlOption
{
    public int OptionId { get; set; }

    public int? ControlId { get; set; }

    public string OptionName { get; set; }

    public string OptionValue { get; set; }

    public bool? IsVisible { get; set; }

    public int LabId { get; set; }

    public string CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public int? SortOrder { get; set; }

    public bool? IsDefaultSelected { get; set; }
}
