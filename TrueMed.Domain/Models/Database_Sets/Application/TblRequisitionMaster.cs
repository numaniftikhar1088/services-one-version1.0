using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionMaster
{
    /// <summary>
    /// Auto Generated ID/Number
    /// </summary>
    public int RequisitionId { get; set; }

    /// <summary>
    /// Order Number
    /// </summary>
    public string? OrderNumber { get; set; }

    /// <summary>
    /// Facility ID (tblLabFacilityAssignment Table)
    /// </summary>
    public int FacilityId { get; set; }

    /// <summary>
    /// Patient ID (tblPatientBasicInfo &amp; tblPatientAddInfo Table)
    /// </summary>
    public int? PatientId { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public DateTime? Dob { get; set; }

    public string? Gender { get; set; }

    /// <summary>
    /// Patient Present Address
    /// </summary>
    public string? Address1 { get; set; }

    /// <summary>
    /// Patient Present Address
    /// </summary>
    public string? Address2 { get; set; }

    /// <summary>
    /// City ID
    /// </summary>
    public string? City { get; set; }

    /// <summary>
    /// State ID
    /// </summary>
    public string? State { get; set; }

    /// <summary>
    /// Country ID
    /// </summary>
    public string? Country { get; set; }

    /// <summary>
    /// Zip Code
    /// </summary>
    public string? ZipCode { get; set; }

    /// <summary>
    /// County
    /// </summary>
    public string? County { get; set; }

    /// <summary>
    /// Patient Land Phone Number
    /// </summary>
    public string? Phone { get; set; }

    /// <summary>
    /// Patient Mobile Number
    /// </summary>
    public string? Mobile { get; set; }

    /// <summary>
    /// Patient Email Address
    /// </summary>
    public string? Email { get; set; }

    public string? Race { get; set; }

    public string? Ethnicity { get; set; }

    public string? SocialSecurityNumber { get; set; }

    public string? PatientDrivingOridnumber { get; set; }

    public string? PassPortNumber { get; set; }

    public string? PatientType { get; set; }

    public string? Height { get; set; }

    public string? Weight { get; set; }

    /// <summary>
    /// Physician ID (tblFacilityUser Table)
    /// </summary>
    public string? PhysicianId { get; set; }

    /// <summary>
    /// Collector ID (tblFacilityUser Table)
    /// </summary>
    public string? CollectorId { get; set; }

    /// <summary>
    /// Specimen Collection Date
    /// </summary>
    public DateTime? DateofCollection { get; set; }

    public string? CollectedBy { get; set; }

    public TimeSpan? TimeofCollection { get; set; }

    /// <summary>
    /// Requisition Status Like Open, Pending, Rejected, Close etc.
    /// </summary>
    public int? RequisitionStatus { get; set; }

    public string? MissingColumns { get; set; }

    public string? OrderType { get; set; }

    public string? StatOrder { get; set; }

    public string? Mileage { get; set; }

    public string? PhysicianSignature { get; set; }

    public string? PatientSignature { get; set; }

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

    public bool? IsDeleted { get; set; }

    public DateTime? DateReceived { get; set; }
}
