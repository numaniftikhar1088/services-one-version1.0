using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabGridTabconfiguration
{
    public int Id { get; set; }

    public int? PageId { get; set; }

    public string? TabName { get; set; }

    public int? TabId { get; set; }

    public int? SortOrder { get; set; }
}
