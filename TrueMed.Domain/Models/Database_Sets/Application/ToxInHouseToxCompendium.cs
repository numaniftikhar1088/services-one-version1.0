using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class ToxInHouseToxCompendium
{
    public int Id { get; set; }

    public string? TestName { get; set; }

    public string? RefferenceRanges { get; set; }

    public string? Units { get; set; }

    public string? SpecimenType { get; set; }

    public string? TestCode { get; set; }

    public string? PerformingLab { get; set; }

    public string? TestonReq { get; set; }

    public string? ThresholdRanges { get; set; }
}
