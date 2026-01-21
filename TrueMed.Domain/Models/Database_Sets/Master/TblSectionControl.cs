using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblSectionControl
{
    public int Id { get; set; }

    public int? SectionId { get; set; }

    public int? ControlId { get; set; }

    public virtual TblControl? Control { get; set; }

    public virtual TblSection? Section { get; set; }
}
