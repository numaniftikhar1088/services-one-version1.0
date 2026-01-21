using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblInsuranceSetup
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int InsuranceId { get; set; }

    /// <summary>
    /// Insurance Type (Federal, Commerical)
    /// </summary>
    public string? InsuranceType { get; set; }

    /// <summary>
    /// Insurance Name (Client Bill, Bill Practice, Bill Insurance, Population Study, Self Pay, Commerical, Medicare, Medicaid, Worker&apos;s Comp DOI, None)
    /// </summary>
    public string? InsuranceName { get; set; }

    /// <summary>
    /// Status (Active, Inactive)
    /// </summary>
    public bool? InsuranceStatus { get; set; }

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
}
