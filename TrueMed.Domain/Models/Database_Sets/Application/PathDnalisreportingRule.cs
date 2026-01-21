using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class PathDnalisreportingRule
{
    public int RulesId { get; set; }

    public string ReportingRule { get; set; }

    public string Age { get; set; }

    public string Negative { get; set; }

    public string Low { get; set; }

    public string Medium { get; set; }

    public string High { get; set; }

    public string CriticallyHigh { get; set; }

    public string NotDetected { get; set; }

    public string Detected { get; set; }

    public string Fail { get; set; }

    public string Pass { get; set; }

    public double? MinAge { get; set; }

    public double? MaxAge { get; set; }

    public decimal? MinLow { get; set; }

    public decimal? MaxLow { get; set; }

    public decimal? MinMedium { get; set; }

    public decimal? MaxMedium { get; set; }

    public decimal? MinHigh { get; set; }

    public decimal? MaxHigh { get; set; }

    public decimal? MinCriticallyHigh { get; set; }

    public decimal? MaxCriticallyHigh { get; set; }

    public decimal? MinDetected { get; set; }

    public decimal? MaxDetected { get; set; }

    public decimal? MinPass { get; set; }

    public decimal? MaxPass { get; set; }

    public string ReqType { get; set; }

    public string IsReportingRuleType { get; set; }

    public string UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string AmpScore { get; set; }

    public string CqConf { get; set; }
}
