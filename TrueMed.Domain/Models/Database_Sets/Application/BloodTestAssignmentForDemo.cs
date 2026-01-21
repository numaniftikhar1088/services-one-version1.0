using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class BloodTestAssignmentForDemo
{
    public int Id { get; set; }

    public int? PanelId { get; set; }

    public string? PanelName { get; set; }

    public int? TestId { get; set; }

    public string? TestName { get; set; }

    public int? SequenceOrder { get; set; }

    public int? PanelSequenceOrder { get; set; }
}
