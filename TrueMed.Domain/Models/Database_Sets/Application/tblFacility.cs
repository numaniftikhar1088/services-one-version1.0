using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblFacility
{
    public int FacilityId { get; set; }

    public string? FacilityName { get; set; }

    public string? Address { get; set; }

    public string? Address2 { get; set; }

    public string State { get; set; } = null!;

    public string? City { get; set; }

    public string? ZipCode { get; set; }

    public string? County { get; set; }

    public string? FacilityPhone { get; set; }

    public string? FacilityFax { get; set; }

    public string? ContactFirstName { get; set; }

    public string? ContactLastName { get; set; }

    public string? ContactPrimaryEmail { get; set; }

    public string? ContactPhone { get; set; }

    public string? CriticalFirstName { get; set; }

    public string? CriticalLastName { get; set; }

    public string? CriticalContactEmail { get; set; }

    public string? CriticalPhone { get; set; }

    public string? Status { get; set; }

    public bool? IsFaxEnabled { get; set; }

    public string? Notes { get; set; }

    public string? LocationCode { get; set; }

    public string? OrganizationCode { get; set; }

    public bool? IsSuspended { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedTime { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdateTime { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? DeleteDate { get; set; }

    public string? DeletedByUserId { get; set; }

    public int? AccountActivationType { get; set; }

    public string? FacilityWebsite { get; set; }

    public bool? IsApproved { get; set; }

    public virtual ICollection<TblFacilityFile> TblFacilityFiles { get; } = new List<TblFacilityFile>();

    public virtual ICollection<TblFacilityOption> TblFacilityOptions { get; } = new List<TblFacilityOption>();

    public virtual ICollection<TblFacilityRefLabAssignment> TblFacilityRefLabAssignments { get; } = new List<TblFacilityRefLabAssignment>();

    public virtual ICollection<TblFacilityReportTemplate> TblFacilityReportTemplates { get; } = new List<TblFacilityReportTemplate>();

    public virtual ICollection<TblFile> TblFiles { get; } = new List<TblFile>();

    public virtual ICollection<TblLabFacInsAssignment> TblLabFacInsAssignments { get; } = new List<TblLabFacInsAssignment>();

    public virtual ICollection<TblPatientAddInfo> TblPatientAddInfos { get; } = new List<TblPatientAddInfo>();

    public virtual ICollection<TblPatientAddrHistory> TblPatientAddrHistories { get; } = new List<TblPatientAddrHistory>();

    public virtual TblShipping? TblShipping { get; set; }
}
