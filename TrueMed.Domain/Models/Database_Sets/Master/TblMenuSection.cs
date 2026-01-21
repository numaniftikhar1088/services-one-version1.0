using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblMenuSection
{
    public int Id { get; set; }

    public int? SectionId { get; set; }

    public int? MenuId { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual TblMenu? Menu { get; set; }

    public virtual TblSection? Section { get; set; }
}
