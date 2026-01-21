using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblFacilityRefLabAssignment
{
    public int Id { get; set; }

    /// <summary>
    /// Facility ID (tblFacility Table)
    /// </summary>
    public int FacilityId { get; set; }

    public int? LabAssignmentId { get; set; }

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
    public bool? IsActive { get; set; }

    public bool? IsDeleted { get; set; }

    public bool IsDefault { get; set; }

    public virtual TblFacility Facility { get; set; } = null!;

    public virtual TblLabAssignment? LabAssignment { get; set; }
}
