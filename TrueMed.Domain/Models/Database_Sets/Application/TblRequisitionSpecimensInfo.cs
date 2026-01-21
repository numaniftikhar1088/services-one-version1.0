using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionSpecimensInfo
{
    /// <summary>
    /// Auto Generated ID/Number
    /// </summary>
    public int RequisitionSpecimenId { get; set; }

    /// <summary>
    /// Requisition Group ID (tblRequisitionGroupInfo Table)
    /// </summary>
    public int RequisitionOrderId { get; set; }

    /// <summary>
    /// Requisition ID (tblRequisitionMaster  / tblRequisitionGroupinfo Tables)
    /// </summary>
    public int RequisitionId { get; set; }

    /// <summary>
    /// Requisition Type ID (tblRequisitionType  / tblRequisitionGroupinfo Tables)
    /// </summary>
    public int? ReqTypeId { get; set; }

    /// <summary>
    /// Specimen Type (tblSpecimenType Table)
    /// </summary>
    public int? SpecimenType { get; set; }

    /// <summary>
    /// Panel ID (tblPanelSetup Table)
    /// </summary>
    public int? PanelId { get; set; }

    /// <summary>
    /// Specimen Bar Code
    /// </summary>
    public string? SpecimenId { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual TblRequisitionOrder RequisitionOrder { get; set; } = null!;
}
