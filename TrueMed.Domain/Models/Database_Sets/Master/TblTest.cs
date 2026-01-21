using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblTest
{
    public int TestId { get; set; }

    public string TestName { get; set; } = null!;

    public string? TestDisplayName { get; set; }

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
