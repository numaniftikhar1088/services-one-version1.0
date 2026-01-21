using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionFile
{
    public int Id { get; set; }

    public string? FileName { get; set; }

    public string? FileUrl { get; set; }

    public int? RequisitionId { get; set; }

    public int? RequisitionOrderId { get; set; }

    public string? TypeOfFile { get; set; }

    public string? RequisitionType { get; set; }

    public bool? SystemGenerated { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool? IsDeleted { get; set; }
}
