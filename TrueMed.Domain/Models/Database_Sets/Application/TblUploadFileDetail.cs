using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblUploadFileDetail
{
    public int Id { get; set; }

    public string UploadPageName { get; set; } = null!;

    public int? LabId { get; set; }

    public string? FileName { get; set; }

    public string? FileType { get; set; }

    public string? FileDataType { get; set; }

    public string? AzureLink { get; set; }

    public string? ReceivedPath { get; set; }

    public string? Status { get; set; }

    public string? ExceptionMessage { get; set; }

    public string? StackMessage { get; set; }

    public DateTime? Csttime { get; set; }

    public bool? IsQueued { get; set; }

    public bool? IsProcessed { get; set; }

    public DateTime? ProcessedDate { get; set; }

    public string? UploadedBy { get; set; }

    public DateTime? UploadedDate { get; set; }

    public bool? IsCompleted { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool IsDeleted { get; set; }
}
