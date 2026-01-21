using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblOptionLookup
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public int? DisplayOrder { get; set; }

    public string? UserType { get; set; }

    public bool? IsActive { get; set; }
}
