using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblIntegrationKeyConfiguration
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Type { get; set; }

    public string? TypeKey { get; set; }

    public string? Tag { get; set; }

    public string? TypeKeyValues { get; set; }
}
