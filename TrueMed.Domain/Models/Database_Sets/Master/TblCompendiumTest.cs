using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblCompendiumTest
{
    public int Id { get; set; }

    public string TestName { get; set; } = null!;

    public string? Tmitcode { get; set; }

    public int? NetworkType { get; set; }

    public int? ReqTypeId { get; set; }

    public bool? IsActive { get; set; }

    public bool IsDeleted { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }
}
