using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblPrinterSetup
{
    public int Id { get; set; }

    public string? PrinterName { get; set; }

    public string? BrandName { get; set; }

    public string? ModelNumber { get; set; }

    public string? LabelSize { get; set; }

    public string? LabelType { get; set; }

    public int? LabId { get; set; }

    public bool IsDefault { get; set; }

    public bool IsDeleted { get; set; }
}
