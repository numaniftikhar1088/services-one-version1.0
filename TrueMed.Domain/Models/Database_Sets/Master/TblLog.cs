using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblLog
{
    public string Id { get; set; } = null!;

    public DateTime CreateDate { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string? PathName { get; set; }

    public int? Status { get; set; }

    public int LogType { get; set; }

    public string? UserId { get; set; }

    public bool IsViewed { get; set; }

    public DateTime? ViewedTime { get; set; }

    public bool IsRead { get; set; }

    public DateTime? ReadTime { get; set; }

    public string? ExceptionMessage { get; set; }

    public DateTime? UpdateTime { get; set; }

    public string? TypeInfo { get; set; }

    public string? ExtentionData { get; set; }
}
