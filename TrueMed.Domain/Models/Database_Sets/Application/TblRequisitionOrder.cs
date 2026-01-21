using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionOrder
{
    /// <summary>
    /// Auto Generated ID/Number
    /// </summary>
    public int RequisitionOrderId { get; set; }

    /// <summary>
    /// Requisition ID (tblRequisitionMaster Table)
    /// </summary>
    public int RequisitionId { get; set; }

    /// <summary>
    /// Record ID
    /// </summary>
    public string? RecordId { get; set; }

    /// <summary>
    /// Requisition Type ID (tblRequisitionType Table)
    /// </summary>
    public int? ReqTypeId { get; set; }

    /// <summary>
    /// Reference Lab ID (tblRefLabAssignment Table)
    /// </summary>
    public int LabId { get; set; }

    public int? LabType { get; set; }

    /// <summary>
    /// Receive Date
    /// </summary>
    public DateTime? DateReceived { get; set; }

    public string? ValidatedBy { get; set; }

    /// <summary>
    /// Validation Date
    /// </summary>
    public DateTime? ValidationDate { get; set; }

    public string? PublishBy { get; set; }

    /// <summary>
    /// Publish Date
    /// </summary>
    public DateTime? PublishedDate { get; set; }

    /// <summary>
    /// Billing Date
    /// </summary>
    public DateTime? BillingDate { get; set; }

    /// <summary>
    /// Requisition Status (Auto Update)
    /// </summary>
    public string? WorkFlowStatus { get; set; }

    /// <summary>
    /// Last Status of Requisition(Auto Update)
    /// </summary>
    public string? LastWorkFlowStatus { get; set; }

    /// <summary>
    /// LIS Status (Auto Update)
    /// </summary>
    public string? Lisstatus { get; set; }

    /// <summary>
    /// Reference ID
    /// </summary>
    public string? ReferenceId { get; set; }

    /// <summary>
    /// User Login ID
    /// </summary>
    public string CreatedBy { get; set; } = null!;

    /// <summary>
    /// Current Created Date and Time
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// Updated By
    /// </summary>
    public string? UpdatedBy { get; set; }

    /// <summary>
    /// Current Updated Date and Time
    /// </summary>
    public DateTime? UpdatedDate { get; set; }

    /// <summary>
    /// User Login ID
    /// </summary>
    public string? DeletedBy { get; set; }

    /// <summary>
    /// Current Deleted Date and Time
    /// </summary>
    public DateTime? DeletedDate { get; set; }

    public bool? IsDeleted { get; set; }

    public string? ActionReasons { get; set; }

    public virtual ICollection<TblRequisitionIcd10code> TblRequisitionIcd10codes { get; } = new List<TblRequisitionIcd10code>();

    public virtual ICollection<TblRequisitionMedication> TblRequisitionMedications { get; } = new List<TblRequisitionMedication>();

    public virtual ICollection<TblRequisitionPanel> TblRequisitionPanels { get; } = new List<TblRequisitionPanel>();

    public virtual ICollection<TblRequisitionSpecimensInfo> TblRequisitionSpecimensInfos { get; } = new List<TblRequisitionSpecimensInfo>();
}
