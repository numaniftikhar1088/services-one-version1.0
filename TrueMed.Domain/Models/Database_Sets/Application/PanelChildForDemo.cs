using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class PanelChildForDemo
{
    public int Id { get; set; }

    public int? TestId { get; set; }

    public string TestName { get; set; }

    public int? ChildTestId { get; set; }

    public string ChildTestName { get; set; }

    public string PerformingLab { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsPrintable { get; set; }

    public int? DisplayOrder { get; set; }
}
