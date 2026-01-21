using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblSectionControl
{
    public int Id { get; set; }

    public int? SectionId { get; set; }

    public int? ControlId { get; set; }

    public virtual TblControl? Control { get; set; }

    public virtual TblSection? Section { get; set; }
}
