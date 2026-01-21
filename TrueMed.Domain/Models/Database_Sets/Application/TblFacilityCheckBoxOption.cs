using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblFacilityCheckBoxOption
{
    public int Key { get; set; }

    public string? Value { get; set; }

    public int? DisplayOrder { get; set; }
}
