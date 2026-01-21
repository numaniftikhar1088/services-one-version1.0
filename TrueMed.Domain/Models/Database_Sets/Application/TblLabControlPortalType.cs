using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabControlPortalType
{
    public int Id { get; set; }

    public int PortalTypeId { get; set; }

    public int ControlId { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual TblControl Control { get; set; } = null!;
}
