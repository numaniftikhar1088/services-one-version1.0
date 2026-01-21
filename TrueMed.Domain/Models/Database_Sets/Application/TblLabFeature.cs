using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabFeature
{
    public int Id { get; set; }

    public string? OptionName { get; set; }

    public string? Configuration { get; set; }

    public bool IsEnabled { get; set; }
}
