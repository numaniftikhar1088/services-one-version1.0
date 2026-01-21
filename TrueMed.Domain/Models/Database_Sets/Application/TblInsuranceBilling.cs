using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblInsuranceBilling
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int BillingId { get; set; }

    public int? ProviderId { get; set; }

    /// <summary>
    /// TMIT Code (Internal Code)
    /// </summary>
    public string Tmitcode { get; set; }

    /// <summary>
    /// External Billing Key (JSN)
    /// </summary>
    public string ExternalBillingKey { get; set; }

    /// <summary>
    /// External Code
    /// </summary>
    public string ExternalCode { get; set; }

    /// <summary>
    /// Login ID
    /// </summary>
    public string CreatedBy { get; set; }

    /// <summary>
    /// Current Date and Time
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// Login ID
    /// </summary>
    public string UpdatedBy { get; set; }

    /// <summary>
    /// Current Modify Date and Time
    /// </summary>
    public DateTime? UpdatedDate { get; set; }

    /// <summary>
    /// Login ID
    /// </summary>
    public string DeletedBy { get; set; }

    /// <summary>
    /// Current Date and Time
    /// </summary>
    public DateTime? DeletedDate { get; set; }

    public bool IsDeleted { get; set; }
}
