using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblIcd10assignment
{
    public int Icd10assignment { get; set; }

    public int? Icd10id { get; set; }

    public int RefLabId { get; set; }

    public string? LabType { get; set; }

    public int? ReqTypeId { get; set; }

    public int FacilityId { get; set; }

    public int? PanelId { get; set; }

    public bool? Status { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool? IsDeleted { get; set; }

    public string? Icd10code { get; set; }

    public string? Icd10description { get; set; }
}
