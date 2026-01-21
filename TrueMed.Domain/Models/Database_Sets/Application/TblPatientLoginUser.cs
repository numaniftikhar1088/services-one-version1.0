using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblPatientLoginUser
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int PatientLoginId { get; set; }

    /// <summary>
    /// Patient ID (tblPatientAddInfo)
    /// </summary>
    public int? PatientId { get; set; }

    /// <summary>
    /// Patient Email (Receive email for username and password)
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Login User Name
    /// </summary>
    public string? UserName { get; set; }

    /// <summary>
    /// Login User Password
    /// </summary>
    public string? LoginPassword { get; set; }

    /// <summary>
    /// Patient Mobile Number (Receive SMS regarding login etc.)
    /// </summary>
    public string? Mobile { get; set; }

    /// <summary>
    /// Login User ID
    /// </summary>
    public string? UpdatedBy { get; set; }

    /// <summary>
    /// Current Updated Date and Time
    /// </summary>
    public DateTime? UpdatedDate { get; set; }

    public virtual TblPatientBasicInfo? Patient { get; set; }
}
