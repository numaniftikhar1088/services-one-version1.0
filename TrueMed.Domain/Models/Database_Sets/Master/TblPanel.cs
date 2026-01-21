using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblPanel
{
    public int PanelId { get; set; }

    public string PanelName { get; set; } = null!;

    public string? PanelDisplayName { get; set; }

    public string? Tmitcode { get; set; }

    public bool? IsActive { get; set; }

    public string? NetworkType { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool IsDeleted { get; set; }

    public virtual ICollection<TblLabTestPanelAssignment> TblLabTestPanelAssignments { get; } = new List<TblLabTestPanelAssignment>();
}
