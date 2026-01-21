using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionPatientInsurance
{
    /// <summary>
    /// Auto Generated ID/Number
    /// </summary>
    public int ReqPatInsId { get; set; }

    /// <summary>
    /// Requisition ID (tblRequisitionMaster  / tblRequisitionGroupinfo Tables)
    /// </summary>
    public int? RequisitionId { get; set; }

    /// <summary>
    /// Patient ID (tblPatientBasicInfo)
    /// </summary>
    public int? PatientId { get; set; }

    /// <summary>
    /// Insurance ID (tblInsuranceSetup / tblPatientInsurance Table)
    /// </summary>
    public int? InsuranceId { get; set; }

    public string? InsuranceName { get; set; }

    public string? BillingType { get; set; }

    public string? RelationshipToInsured { get; set; }

    public int? InsuranceProviderId { get; set; }

    public string? PrimaryGroupId { get; set; }

    public string? PrimaryPolicyId { get; set; }

    public string? InsurancePhone { get; set; }

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

    public string? SubscriberName { get; set; }

    public DateTime? SubscriberDob { get; set; }

    /// <summary>
    /// User Login ID
    /// </summary>
    public string? CreatedBy { get; set; }

    /// <summary>
    /// Current Created Date and Time
    /// </summary>
    public DateTime? CreatedDate { get; set; }

    /// <summary>
    /// User Login ID
    /// </summary>
    public string? UpdatedBy { get; set; }

    /// <summary>
    /// Current Modify Date and Time
    /// </summary>
    public DateTime? UpdatedDate { get; set; }

    /// <summary>
    /// User Login ID
    /// </summary>
    public string? DeletedBy { get; set; }

    /// <summary>
    /// Current Deleted Date and Time
    /// </summary>
    public DateTime? DeletedDate { get; set; }

    public bool IsDeleted { get; set; }
}
