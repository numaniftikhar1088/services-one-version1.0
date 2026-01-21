using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionInitialWorkflowStatus
{
    public int Id { get; set; }

    public int? LabId { get; set; }

    public int? ReqTypeId { get; set; }

    public int? PortalTypeId { get; set; }

    public string? Jsonsetting { get; set; }

    public int? InitialWorkFlowId { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool? IsDeleted { get; set; }
}
