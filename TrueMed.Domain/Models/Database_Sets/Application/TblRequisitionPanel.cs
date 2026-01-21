using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionPanel
{
    /// <summary>
    /// Auto Generated ID/Number
    /// </summary>
    public int RequisitionPanelId { get; set; }

    /// <summary>
    /// Requisition Group ID (tblRequisitionGroupInfo Table)
    /// </summary>
    public int RequisitionOrderId { get; set; }

    /// <summary>
    /// Requisition ID (tblRequisitionMaster / tblRequisitionGroupInfo Tables)
    /// </summary>
    public int RequisitionId { get; set; }

    /// <summary>
    /// Requisition Type ID (tblRequisitionType / tblRequisitionGroupInfo Tables)
    /// </summary>
    public int? ReqTypeId { get; set; }

    public int? GroupId { get; set; }

    public string? GroupName { get; set; }

    /// <summary>
    /// Panel ID (tblPanelSetup / tblGPT_Assignment Tables)
    /// </summary>
    public int? PanelId { get; set; }

    public string? PanelName { get; set; }

    public virtual TblRequisitionOrder RequisitionOrder { get; set; } = null!;
}
