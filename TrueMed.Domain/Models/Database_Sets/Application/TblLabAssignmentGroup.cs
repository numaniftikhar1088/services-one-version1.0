using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabAssignmentGroup
{
    public int Id { get; set; }

    public int LabAssignmentId { get; set; }

    public int GroupId { get; set; }

    public virtual TblCompendiumGroup Group { get; set; } = null!;

    public virtual TblLabAssignment LabAssignment { get; set; } = null!;
}
