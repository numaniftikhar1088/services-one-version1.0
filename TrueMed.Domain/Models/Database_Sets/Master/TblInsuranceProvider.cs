using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblInsuranceProvider
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int InsuranceProviderId { get; set; }

    /// <summary>
    /// Insurance Provider Name
    /// </summary>
    public string? ProviderName { get; set; }

    public string? Address1 { get; set; }

    public string? Address2 { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? ZipCode { get; set; }

    public string? LandPhone { get; set; }

    public string? ProviderCode { get; set; }

    /// <summary>
    /// Status (Active, Inactive)
    /// </summary>
    public bool? ProviderStatus { get; set; }

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

    public bool? IsDeleted { get; set; }

    //public virtual ICollection<TblInsTestAssignment> TblInsTestAssignments { get; } = new List<TblInsTestAssignment>();
}
