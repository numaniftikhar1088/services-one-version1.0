using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblIdresultDataLog
{
    public int DataLogId { get; set; }

    public int? RawDataId { get; set; }

    public int? UploadFileId { get; set; }

    public int? RowNumber { get; set; }

    public int? RequisitionOrderId { get; set; }

    public int? SpecimenId { get; set; }

    public string? SampleName { get; set; }

    public bool? IsProcessed { get; set; }

    public string? ExceptionMessage { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
}
