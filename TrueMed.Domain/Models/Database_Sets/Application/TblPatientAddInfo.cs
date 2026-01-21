using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblPatientAddInfo
{
    /// <summary>
    /// Auto Generated Number
    /// </summary>
    public int PatientAddInfoId { get; set; }

    /// <summary>
    /// Patient ID (PatientBasicInfo Table)
    /// </summary>
    public int PatientId { get; set; }

    /// <summary>
    /// Address
    /// </summary>
    public string? Address1 { get; set; }

    /// <summary>
    /// Address
    /// </summary>
    public string? Address2 { get; set; }

    /// <summary>
    /// Zip Code
    /// </summary>
    public string? ZipCode { get; set; }

    /// <summary>
    /// City
    /// </summary>
    public string? City { get; set; }

    /// <summary>
    /// State / Province
    /// </summary>
    public string? State { get; set; }

    /// <summary>
    /// Country
    /// </summary>
    public string? Country { get; set; }

    /// <summary>
    /// County
    /// </summary>
    public string? County { get; set; }

    /// <summary>
    /// Land Phone Number
    /// </summary>
    public string? Phone { get; set; }

    /// <summary>
    /// Mobile Number
    /// </summary>
    public string? Mobile { get; set; }

    /// <summary>
    /// Email (Where he want to receive email for login / resulting/ queries)
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Current Weight
    /// </summary>
    public string? Weight { get; set; }

    /// <summary>
    /// Current Height
    /// </summary>
    public string? Height { get; set; }

    /// <summary>
    /// Facility ID (Where he visited)
    /// </summary>
    public int FacilityId { get; set; }

    /// <summary>
    /// User Login ID
    /// </summary>
    public string? UpdatedBy { get; set; }

    /// <summary>
    /// Current Modify Date and Time
    /// </summary>
    public DateTime? UpdatedDate { get; set; }

    public virtual TblFacility Facility { get; set; } = null!;

    public virtual TblPatientBasicInfo Patient { get; set; } = null!;
}
