using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionIcd10code
{
    /// <summary>
    /// Auto Generated ID/Number
    /// </summary>
    public int RequisitionIcd10id { get; set; }

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

    /// <summary>
    /// ICD10 Code
    /// </summary>
    public string? Icd10code { get; set; }

    /// <summary>
    /// Description of ICD10 Code
    /// </summary>
    public string? Icd10description { get; set; }

    /// <summary>
    /// ICD10 Code Type
    /// </summary>
    public string? Icd10type { get; set; }

    public virtual TblRequisitionOrder RequisitionOrder { get; set; } = null!;
}
