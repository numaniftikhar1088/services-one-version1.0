using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabFacInsAssignment
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Reference Lab (tblLabs Table) - Inhouse or Reference
    /// </summary>
    public int LabId { get; set; }

    /// <summary>
    /// Lab Type (Inhouse, Reference)
    /// </summary>
    public string? LabType { get; set; }

    /// <summary>
    /// Facility ID (tblFacility Table)
    /// </summary>
    public int FacilityId { get; set; }

    /// <summary>
    /// Requisition Type ID (tblRequisitionType Table)
    /// </summary>
    public int? ReqTypeId { get; set; }

    /// <summary>
    /// Group ID (tblGroupSetup Table)
    /// </summary>
    public int? GroupId { get; set; }

    /// <summary>
    /// Insurance ID (tblInsuranceSetup Table)
    /// </summary>
    public int? InsuranceId { get; set; }

    public int? InsuranceOptionId { get; set; }

    /// <summary>
    /// Gender (Male, Female, Unknown, Intersex)
    /// </summary>
    public string? Gender { get; set; }

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

    /// <summary>
    /// Status (Active, Inactive)
    /// </summary>
    public bool? Status { get; set; }

    public bool? IsDeleted { get; set; }

    public bool? IsDefault { get; set; }

    public virtual TblFacility Facility { get; set; } = null!;
}
