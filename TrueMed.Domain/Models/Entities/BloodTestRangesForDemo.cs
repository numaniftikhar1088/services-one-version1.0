using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Entities;

public partial class BloodTestRangesForDemo
{
    public int Id { get; set; }

    public int? TestId { get; set; }

    public string TestName { get; set; }

    public string TestCode { get; set; }

    public string ReferenceValueType { get; set; }

    public string Sex { get; set; }

    public decimal? MinAge { get; set; }

    public decimal? MaxAge { get; set; }

    public double? Low { get; set; }

    public double? High { get; set; }

    public double? CriticalValueLow { get; set; }

    public double? CriticalValueHigh { get; set; }

    public string Comment { get; set; }

    public string ResultFlag { get; set; }

    public string Optimal { get; set; }

    public string Optimalvalue { get; set; }

    public string IntermediateRangeA { get; set; }

    public string IntermediateRangeB { get; set; }

    public string HighRisk { get; set; }

    public string HighRiskValue { get; set; }

    public string ModifyBy { get; set; }

    public string LowCritical { get; set; }

    public string HighCritical { get; set; }
}
