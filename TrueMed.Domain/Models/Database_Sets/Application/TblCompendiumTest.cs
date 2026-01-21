using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblCompendiumTest
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Test Name
    /// </summary>
    public string TestName { get; set; } = null!;

    /// <summary>
    /// TMIT Code (Internal Code)
    /// </summary>
    public string? Tmitcode { get; set; }

    public int? Department { get; set; }

    /// <summary>
    /// Requisition Type ID (tblRequisitionType Table)
    /// </summary>
    public int? ReqTypeId { get; set; }

    public int? Testidentifier { get; set; }

    /// <summary>
    /// Status (Active, Inactive)
    /// </summary>
    public bool? IsActive { get; set; }

    public bool IsDeleted { get; set; }

    /// <summary>
    /// Login ID
    /// </summary>
    public string CreatedBy { get; set; } = null!;

    /// <summary>
    /// Current Created Date and Time)
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// Login ID
    /// </summary>
    public string? UpdatedBy { get; set; }

    /// <summary>
    /// Current Modify Date and Time
    /// </summary>
    public DateTime? UpdatedDate { get; set; }

    /// <summary>
    /// Login ID
    /// </summary>
    public string? DeletedBy { get; set; }

    /// <summary>
    /// Current Date and Time
    /// </summary>
    public DateTime? DeletedDate { get; set; }
}
