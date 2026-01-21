using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblTestType
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int TestTypeId { get; set; }

    /// <summary>
    /// Test Type like individual, group
    /// </summary>
    public string TestType { get; set; } = null!;

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
    public bool? TestTypeStatus { get; set; }

    public bool IsDeleted { get; set; }
}
