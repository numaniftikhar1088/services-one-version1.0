using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblCompendiumPanelTestAssignment
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int Id { get; set; }

    public int? PanelId { get; set; }

    /// <summary>
    /// Test Name
    /// </summary>
    public int? TestConfigId { get; set; }

    /// <summary>
    /// Test Name
    /// </summary>
    public int? TestId { get; set; }

    public int? ReportingRuleId { get; set; }

    /// <summary>
    /// Status (Active, Inactive)
    /// </summary>
    public bool? IsActive { get; set; }

    public string? AntibioticClass { get; set; }

    public bool? IsResistance { get; set; }

    public int? NumberOfDetected { get; set; }

    public int? NumberOfRepeated { get; set; }

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
