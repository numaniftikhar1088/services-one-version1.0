using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblCompendiumTestConfiguration
{
    public int Id { get; set; }

    public int? TestId { get; set; }

    public int? GroupTestId { get; set; }

    public string? TestDisplayName { get; set; }

    public int? ReferenceLabId { get; set; }

    public string? ExernalMappingKey { get; set; }

    public string? TestCode { get; set; }

    public string? OrderCode { get; set; }

    public string? ResultCode { get; set; }

    public int? ReqTypeId { get; set; }

    public string? Department { get; set; }

    public string? Unit { get; set; }

    public int? SpecimenTypeId { get; set; }

    public string? ResultType { get; set; }

    public string? InstrumentName { get; set; }

    public string? InstrumentResultingMethod { get; set; }

    public int? CalcuationFormulaId { get; set; }

    public string? OrderMethodType { get; set; }

    public string? OrderMethodName { get; set; }

    public string? Cptcode { get; set; }

    public bool? IsControl { get; set; }

    public int? SortOrder { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsDeleted { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }
}
