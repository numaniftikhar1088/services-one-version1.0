using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblCompendiumReportingRule
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? RuleType { get; set; }

    public string? Gender { get; set; }

    public int? AgeFrom { get; set; }

    public int? AgeTo { get; set; }

    public string? CuttoffExpression { get; set; }

    public decimal? CuttOffValue { get; set; }

    public string? Text { get; set; }

    public string? MinLowExpression { get; set; }

    public decimal? MinLow { get; set; }

    public string? MaxLowExpression { get; set; }

    public decimal? MaxLow { get; set; }

    public string? LowFlag { get; set; }

    public string? MinInterExpression { get; set; }

    public decimal? MinInter { get; set; }

    public string? MaxInterExpression { get; set; }

    public decimal? MaxInter { get; set; }

    public string? InterOrMatchingFlag { get; set; }

    public string? MinHighExpression { get; set; }

    public decimal? MinHigh { get; set; }

    public string? MaxHighExpression { get; set; }

    public decimal? MaxHigh { get; set; }

    public decimal? MinCriticalHigh { get; set; }

    public decimal? MaxCriticalHigh { get; set; }

    public string? HighOrNonMatchingFlag { get; set; }

    public int? SortOrder { get; set; }

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

    public int? ReqTypeId { get; set; }

    public decimal? AmpScore { get; set; }

    public decimal? CqConf { get; set; }

    public string? Negative { get; set; }
}
