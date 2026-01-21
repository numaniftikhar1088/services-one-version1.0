using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblWorkFlowStatus
{
    public int Id { get; set; }

    public string WorkFlowstatus { get; set; } = null!;

    public string? WorkFlowDescription { get; set; }

    public string? WorkFlowColorStatus { get; set; }

    public string? WorkFlowDisplayName { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<TblLabRequisitionTypeWorkflowStatus> TblLabRequisitionTypeWorkflowStatusCurrentWorkFlows { get; } = new List<TblLabRequisitionTypeWorkflowStatus>();

    public virtual ICollection<TblLabRequisitionTypeWorkflowStatus> TblLabRequisitionTypeWorkflowStatusNextWorkFlowIdforAdminNavigations { get; } = new List<TblLabRequisitionTypeWorkflowStatus>();

    public virtual ICollection<TblLabRequisitionTypeWorkflowStatus> TblLabRequisitionTypeWorkflowStatusNextWorkFlowIdforPhysicianNavigations { get; } = new List<TblLabRequisitionTypeWorkflowStatus>();
}
