using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblCompendiumPanelAssignment
{
    public int Id { get; set; }

    public int? ParentPanelId { get; set; }

    public int? ChildPanelId { get; set; }

    public string? PanelDisplayName { get; set; }

    public string? OrderingMethod { get; set; }

    public string? RequsitionDispalyType { get; set; }

    public int? ReferenceLabId { get; set; }

    public string? OrderCode { get; set; }

    public int? SortOrder { get; set; }

    /// <summary>
    /// Status (Active, Inactive)
    /// </summary>
    public bool? IsActive { get; set; }

    public bool? IsDeleted { get; set; }

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

    public int? PanelTypeId { get; set; }
}
