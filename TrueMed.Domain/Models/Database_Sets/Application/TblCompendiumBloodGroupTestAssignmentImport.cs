using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblCompendiumBloodGroupTestAssignmentImport
{
    public int Id { get; set; }

    public string TestName { get; set; }

    public string ChildTestName { get; set; }

    public string ChildTestCode { get; set; }

    public string PerformingLab { get; set; }

    public string Unit { get; set; }

    public string TestType { get; set; }

    public string ResultMethod { get; set; }

    public string ResultMethodOption { get; set; }

    public string OrderMethod { get; set; }

    public string OrderMethodOption { get; set; }

    public string SpecimentType { get; set; }
}
