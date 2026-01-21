using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblPanelType
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int PanelTypeId { get; set; }

    /// <summary>
    /// Panel Type
    /// </summary>
    public string PanelType { get; set; } = null!;

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

    /// <summary>
    /// Status (Active, Inactive)
    /// </summary>
    public bool? PanelTypeStatus { get; set; }

    public bool IsDeleted { get; set; }
}
