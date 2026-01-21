using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblCompendiumGroup
{
    /// <summary>
    /// Auto Generated Number
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Group Name - Compendium Data
    /// </summary>
    public string GroupName { get; set; } = null!;

    public string? Description { get; set; }

    public int? ReqTypeId { get; set; }

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
    /// Current Created Data and Time of login user time zone
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// Login ID
    /// </summary>
    public string? UpdatedBy { get; set; }

    /// <summary>
    /// Current Modify Date and Time of login user time zone
    /// </summary>
    public DateTime? UpdatedDate { get; set; }

    /// <summary>
    /// Login ID
    /// </summary>
    public string? DeletedBy { get; set; }

    /// <summary>
    /// Current Delete Date and Time of login user time zone
    /// </summary>
    public DateTime? DeletedDate { get; set; }

    public virtual ICollection<TblLabAssignmentGroup> TblLabAssignmentGroups { get; } = new List<TblLabAssignmentGroup>();
}
