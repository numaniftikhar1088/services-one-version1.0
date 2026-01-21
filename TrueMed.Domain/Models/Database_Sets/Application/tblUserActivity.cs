using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblUserActivity
{
    public string Id { get; set; } = null!;

    public DateTime CreateDate { get; set; }

    public string UserId { get; set; } = null!;

    public int ActivityType { get; set; }

    public int ActionType { get; set; }

    public string? ActionDescription { get; set; }

    public string? ExtentionData { get; set; }

    public string? EventName { get; set; }

    public string? ActivityActionPage { get; set; }
}
