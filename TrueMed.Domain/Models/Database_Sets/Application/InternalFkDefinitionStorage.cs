using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class InternalFkDefinitionStorage
{
    public int Id { get; set; }

    public string FkName { get; set; } = null!;

    public string FkCreationStatement { get; set; } = null!;

    public string FkDestructionStatement { get; set; } = null!;

    public string TableTruncationStatement { get; set; } = null!;
}
