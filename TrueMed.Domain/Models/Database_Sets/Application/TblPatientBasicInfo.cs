using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblPatientBasicInfo
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int PatientId { get; set; }

    /// <summary>
    /// Patient First Name
    /// </summary>
    public string FirstName { get; set; } = null!;

    /// <summary>
    /// Patient Middle Name
    /// </summary>
    public string? MiddleName { get; set; }

    /// <summary>
    /// Patient Last Name
    /// </summary>
    public string LastName { get; set; } = null!;

    /// <summary>
    /// Patient Date of Birth
    /// </summary>
    public DateTime Dob { get; set; }

    /// <summary>
    /// Patient Gender (Male, Female, Intersex, Prefer not to answer, Unknown)
    /// </summary>
    public string? Gender { get; set; }

    /// <summary>
    /// Patient Social Security Number
    /// </summary>
    public string? SocialSecurityNumber { get; set; }

    /// <summary>
    /// Patient Ethnicity (Hispanic or Latino, Not Hispanic or Latino, Not Specified)
    /// </summary>
    public string? Ethnicity { get; set; }

    /// <summary>
    /// Patient Race (Asian, White, Black, American Indian / AK, Hawaiian/Pacific, Not Specified, Unknown, Other)
    /// </summary>
    public string? Race { get; set; }

    /// <summary>
    /// Patient Valid Passport Number
    /// </summary>
    public string? PassPortNumber { get; set; }

    public int? FacilityId { get; set; }

    /// <summary>
    /// Login User ID
    /// </summary>
    public string CreatedBy { get; set; } = null!;

    /// <summary>
    /// Current Created Date and Time
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// Login User ID
    /// </summary>
    public string? UpdatedBy { get; set; }

    /// <summary>
    /// Current Modify Date and Time
    /// </summary>
    public DateTime? UpdatedDate { get; set; }

    /// <summary>
    /// Patient Login UserID (Patient Portal)
    /// </summary>
    public string? PatientUserId { get; set; }

    public string? PatientDrivingOridnumber { get; set; }

    public string? PatientType { get; set; }

    public bool IsDeleted { get; set; }

    public virtual ICollection<TblPatientAddInfo> TblPatientAddInfos { get; } = new List<TblPatientAddInfo>();

    public virtual ICollection<TblPatientAddrHistory> TblPatientAddrHistories { get; } = new List<TblPatientAddrHistory>();

    public virtual ICollection<TblPatientInsurance> TblPatientInsurances { get; } = new List<TblPatientInsurance>();

    public virtual ICollection<TblPatientLoginUser> TblPatientLoginUsers { get; } = new List<TblPatientLoginUser>();
}
