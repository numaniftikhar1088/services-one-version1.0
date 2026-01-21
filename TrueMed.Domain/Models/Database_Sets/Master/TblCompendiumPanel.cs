using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblCompendiumPanel
{
    public int Id { get; set; }

    public string PanelName { get; set; } = null!;

    public int? ReqTypeId { get; set; }

    public string? Tmitcode { get; set; }

    public int? NetworkType { get; set; }

    public bool? IsActive { get; set; }

    public bool IsDeleted { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }
}
