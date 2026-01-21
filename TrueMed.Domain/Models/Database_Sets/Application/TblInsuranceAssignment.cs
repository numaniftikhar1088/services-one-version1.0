using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblInsuranceAssignment
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int InsuranceAssignmentId { get; set; }

    /// <summary>
    /// Insurance Provider ID
    /// </summary>
    public int? ProviderId { get; set; }

    /// <summary>
    /// Insurance Provider Display Name (Provider Name display on Report)
    /// </summary>
    public string? ProviderDisplayName { get; set; }

    public string? ProviderCode { get; set; }

    /// <summary>
    /// Insurance ID (tblInsuranceSetup table)
    /// </summary>
    public int? InsuranceId { get; set; }

    public string? InsuranceType { get; set; }

    public int? OptionId { get; set; }

    /// <summary>
    /// Status (Active, Inactive)
    /// </summary>
    public bool? Status { get; set; }

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

    public string? DeletedBy { get; set; }

    /// <summary>
    /// Current Date and Time
    /// </summary>
    public DateTime? DeletedDate { get; set; }

    public bool IsDeleted { get; set; }
}
