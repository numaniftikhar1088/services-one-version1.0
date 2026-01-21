using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblAutoNumberIdformat
{
    public int Id { get; set; }

    public string Idname { get; set; }

    public string PreFixType { get; set; }

    public string FixedPreFix { get; set; }

    public string PostFixType { get; set; }

    public string FixedPostFix { get; set; }

    public string Seperator { get; set; }

    public int? StartingNumber { get; set; }

    public int? TotalLengthOfStartingNumber { get; set; }

    public string IncrementOn { get; set; }

    public int? IncrementBy { get; set; }

    public string InitializeOn { get; set; }

    public string IddateFormat { get; set; }

    public int? LabId { get; set; }

    public string LabTimeZone { get; set; }

    public bool IsDeleted { get; set; }
}
