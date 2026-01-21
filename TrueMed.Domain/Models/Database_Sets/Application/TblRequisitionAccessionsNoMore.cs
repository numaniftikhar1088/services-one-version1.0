using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionAccessionsNoMore
{
    public int RequisitionAccessionId { get; set; }

    public int? RequisitionOrderId { get; set; }

    public int? RequisitionId { get; set; }

    public int? SpecimenType { get; set; }

    public string? AccessionNumber { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
}
