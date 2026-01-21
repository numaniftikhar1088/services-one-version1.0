using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLisresultSetting
{
    public int Id { get; set; }

    public int? LabId { get; set; }

    public string? FileType { get; set; }

    public string? Jsonsetting { get; set; }
}
