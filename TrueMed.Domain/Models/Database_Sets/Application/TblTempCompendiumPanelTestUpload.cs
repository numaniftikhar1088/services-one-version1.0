using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblTempCompendiumPanelTestUpload
{
    public int Id { get; set; }

    public string? PerformingLab { get; set; }

    public string? PanelName { get; set; }

    public string? PanelCode { get; set; }

    public string? AssayName { get; set; }

    public string? Organisim { get; set; }

    public string? TestCode { get; set; }

    public string? AntibiotecClass { get; set; }

    public string? Resistance { get; set; }

    public string UploadStatus { get; set; } = null!;

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? GroupName { get; set; }
}
