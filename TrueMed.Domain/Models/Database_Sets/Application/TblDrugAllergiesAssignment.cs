using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblDrugAllergiesAssignment
{
    public int Id { get; set; }

    public string Daid { get; set; } = null!;

    public string? DrugName { get; set; }

    public int RefLabId { get; set; }

    public string? LabType { get; set; }

    public int? ReqTypeId { get; set; }

    public int FacilityId { get; set; }

    public int? PanelId { get; set; }

    public bool? IsStatus { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool? IsDeleted { get; set; }
}
