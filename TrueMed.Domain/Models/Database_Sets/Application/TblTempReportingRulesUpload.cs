using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblTempReportingRulesUpload
{
    public int Id { get; set; }

    public string? TestCode { get; set; }

    public int AgeFrom { get; set; }

    public int AgeTo { get; set; }

    public decimal? MaxLow { get; set; }

    public decimal? MinLow { get; set; }

    public decimal? MaxMedium { get; set; }

    public decimal? MinMedium { get; set; }

    public decimal? MaxHigh { get; set; }

    public decimal? MinHigh { get; set; }

    public decimal? MaxCrticalHigh { get; set; }

    public decimal? MinCriticalHigh { get; set; }

    public int? AmpScore { get; set; }

    public int? CqConf { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime? CreatedDate { get; set; }

    public string UploadStatus { get; set; } = null!;

    public string? Negative { get; set; }
}
