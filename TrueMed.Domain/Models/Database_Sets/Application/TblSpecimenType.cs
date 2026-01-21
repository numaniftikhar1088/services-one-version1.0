using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblSpecimenType
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int SpecimenTypeId { get; set; }

    /// <summary>
    /// Specimen Type like Blood, Urine etc.
    /// </summary>
    public string SpecimenType { get; set; } = null!;

    public string? SpecimenPreFix { get; set; }

    /// <summary>
    /// Login ID
    /// </summary>
    public string? CreatedBy { get; set; }

    /// <summary>
    /// Current Created Date and Time
    /// </summary>
    public DateTime? CreatedDate { get; set; }

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
    public bool? SpecimenStatus { get; set; }

    public bool IsDeleted { get; set; }
}
