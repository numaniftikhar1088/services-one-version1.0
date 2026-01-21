using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblFacilityFile
{
    public string FileId { get; set; } = null!;

    public int FacilityId { get; set; }

    public string FileType { get; set; } = null!;

    public string? Report { get; set; }

    public virtual TblFacility Facility { get; set; } = null!;
}
