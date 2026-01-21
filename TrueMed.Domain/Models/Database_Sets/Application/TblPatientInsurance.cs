using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblPatientInsurance
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int PatientInsuranceId { get; set; }

    /// <summary>
    /// Patient ID (tblPatientBasicInfo)
    /// </summary>
    public int? PatientId { get; set; }

    /// <summary>
    /// Insurance ID (tblInsuranceSetup)
    /// </summary>
    public int? InsuranceId { get; set; }

    /// <summary>
    /// Insurance Provider ID (tblInsuranceProvider)
    /// </summary>
    public int? InsuranceProviderId { get; set; }

    /// <summary>
    /// Group Number
    /// </summary>
    public string? PrimaryGroupId { get; set; }

    /// <summary>
    /// Policy ID
    /// </summary>
    public string? PrimaryPolicyId { get; set; }

    /// <summary>
    /// Subscriber First Name
    /// </summary>
    public string? SubscriberName { get; set; }

    /// <summary>
    /// Subscriber Date of Birth
    /// </summary>
    public DateTime? SubscriberDob { get; set; }

    /// <summary>
    /// Subscriber Relation (Relation with Subscriber) Like Spouse, Father, Son etc.
    /// </summary>
    public string? RelationshipToInsured { get; set; }

    /// <summary>
    /// User Login ID
    /// </summary>
    public string CreatedBy { get; set; } = null!;

    /// <summary>
    /// Current Date and Time
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// User Login ID
    /// </summary>
    public string? UpdatedBy { get; set; }

    /// <summary>
    /// Current Date and Time
    /// </summary>
    public DateTime? UpdatedDate { get; set; }

    public string? InsurancePhone { get; set; }

    public string? BillingType { get; set; }

    /// <summary>
    /// Date of Accident
    /// </summary>
    public DateTime? AccidentDate { get; set; }

    /// <summary>
    /// Type of Accident (Static Dropdown)
    /// </summary>
    public string? AccidentType { get; set; }

    /// <summary>
    /// State
    /// </summary>
    public string? AccidentState { get; set; }

    /// <summary>
    /// User Login ID
    /// </summary>
    public string? DeletedBy { get; set; }

    /// <summary>
    /// Current Deleted Date and Time
    /// </summary>
    public DateTime? DeletedDate { get; set; }

    public bool IsDeleted { get; set; }

    public virtual TblPatientBasicInfo? Patient { get; set; }
}
