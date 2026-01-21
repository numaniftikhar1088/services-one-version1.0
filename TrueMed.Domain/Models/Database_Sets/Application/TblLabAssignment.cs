using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabAssignment
{
    public int Id { get; set; }

    public string ProfileName { get; set; } = null!;

    public int RefLabId { get; set; }

    public int LabType { get; set; }

    public int ReqTypeId { get; set; }

    public string? InsuranceId { get; set; }

    public string? InsuranceOptionId { get; set; }

    public string? Gender { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsDeleted { get; set; }

    public bool IsDefault { get; set; }

    public virtual TblLab RefLab { get; set; } = null!;

    public virtual TblLabRequisitionType ReqType { get; set; } = null!;

    public virtual ICollection<TblFacilityRefLabAssignment> TblFacilityRefLabAssignments { get; } = new List<TblFacilityRefLabAssignment>();

    public virtual ICollection<TblLabAssignmentGroup> TblLabAssignmentGroups { get; } = new List<TblLabAssignmentGroup>();
}
