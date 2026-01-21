using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblCompendiumPanel
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Panel Name
    /// </summary>
    public string PanelName { get; set; } = null!;

    /// <summary>
    /// Panel Type ID (tblPanelType Table)
    /// </summary>
    public int? ReqTypeId { get; set; }

    public string? Tmitcode { get; set; }

    public string? Department { get; set; }

    public string? PanelColor { get; set; }

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
    /// Current Created Date and Time
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
