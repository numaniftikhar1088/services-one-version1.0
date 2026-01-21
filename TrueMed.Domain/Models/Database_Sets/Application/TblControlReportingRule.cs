using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblControlReportingRule
{
    public int Id { get; set; }

    public string? QccontrolName { get; set; }

    public int? LabId { get; set; }

    public string? QccontrolType { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? CreatedBy { get; set; }

    public bool? UndeterminedResult { get; set; }

    public decimal? MinPass { get; set; }

    public decimal? MaxPass { get; set; }

    public decimal? MinFail { get; set; }

    public decimal? MaxFail { get; set; }
}
