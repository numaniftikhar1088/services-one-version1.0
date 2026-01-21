using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionAddInfo
{
    /// <summary>
    /// Auto Generated ID/Number
    /// </summary>
    public int RequisitionAddInfoId { get; set; }

    /// <summary>
    /// Requisition Group ID (tblRequisitionGroupInfo Table)
    /// </summary>
    public int RequisitionOrderId { get; set; }

    /// <summary>
    /// Requisition ID (tblRequisitionMaster  / tblRequisitionGroupinfo Tables)
    /// </summary>
    public int? RequisitionId { get; set; }

    /// <summary>
    /// Requisition Type ID (tblRequisitionType / tblRequisitionGroupinfo Tables)
    /// </summary>
    public int? ReqTypeId { get; set; }

    public int? SectionId { get; set; }

    public int? ControlId { get; set; }

    public string? ControlValue { get; set; }

    /// <summary>
    /// Key ID (JSN)
    /// </summary>
    public string? KeyId { get; set; }

    /// <summary>
    /// Key Value (JSN)
    /// </summary>
    public string? KeyValue { get; set; }

    public int SectionIdentifier { get; set; }
}
