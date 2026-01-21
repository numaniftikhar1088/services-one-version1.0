using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblIcdcodeForDemo
{
    public int Id { get; set; }

    public string? Code { get; set; }

    public string? CodeType { get; set; }

    public string? Description { get; set; }

    public string? MediTechApproved { get; set; }

    public int? FormId { get; set; }

    public string? ApprovedBy { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public string? RequisitionType { get; set; }

    public string? RecordId { get; set; }

    public string? BillingEntity { get; set; }

    public string? RejectedBy { get; set; }

    public DateTime? Rejecteddate { get; set; }

    public bool? RejectedFlag { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public string? Status { get; set; }
}
