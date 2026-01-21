using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabRequisitionTypeWorkflowStatus
{
    public int Id { get; set; }

    public int LabId { get; set; }

    public int ReqTypeId { get; set; }

    public int PortalTypeId { get; set; }

    public int? CurrentWorkFlowId { get; set; }

    public string? ActionPerformed { get; set; }

    public int? NextWorkFlowIdforPhysician { get; set; }

    public int? NextWorkFlowIdforAdmin { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool? IsActive { get; set; }

    public virtual TblWorkFlowStatus? CurrentWorkFlow { get; set; }

    public virtual TblWorkFlowStatus? NextWorkFlowIdforAdminNavigation { get; set; }

    public virtual TblWorkFlowStatus? NextWorkFlowIdforPhysicianNavigation { get; set; }

    public virtual TblLabRequisitionType ReqType { get; set; } = null!;
}
