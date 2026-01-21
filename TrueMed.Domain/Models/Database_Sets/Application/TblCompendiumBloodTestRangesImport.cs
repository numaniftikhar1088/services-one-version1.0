using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblCompendiumBloodTestRangesImport
{
    public int Id { get; set; }

    public string? TestName { get; set; }

    public double? TestCode { get; set; }

    public string? ReferenceValueType { get; set; }

    public string? Sex { get; set; }

    public double? MinAge { get; set; }

    public double? MaxAge { get; set; }

    public double? Low { get; set; }

    public double? High { get; set; }

    public string? CriticalValueLow { get; set; }

    public string? CriticalValueHigh { get; set; }

    public string? Uint { get; set; }

    public string? SpecimentType { get; set; }

    public string? LowFlag { get; set; }

    public string? InRangeFlag { get; set; }

    public string? HighFlag { get; set; }
}
