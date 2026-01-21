using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class ToxConfirmationToxCompendium
{
    public int Id { get; set; }

    public string? PanelName { get; set; }

    public string? TestName { get; set; }

    public double? Cutoff { get; set; }

    public double? Linearity { get; set; }

    public string? Unit { get; set; }

    public string? SpecimenType { get; set; }

    public string? TestCode { get; set; }

    public string? PerformingLab { get; set; }

    public string? DrugClass { get; set; }
}
