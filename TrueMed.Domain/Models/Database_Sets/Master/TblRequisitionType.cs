using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblRequisitionType
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int ReqTypeId { get; set; }

    /// <summary>
    /// Requisition Type
    /// </summary>
    public string RequisitionType { get; set; } = null!;

    /// <summary>
    /// Requisition Type Name like Infectious Disease, Blood, Tox etc.
    /// </summary>
    public string RequisitionTypeName { get; set; } = null!;

    public string? RequisitionColor { get; set; }

    /// <summary>
    /// Login ID
    /// </summary>
    public string CreatedBy { get; set; } = null!;

    /// <summary>
    /// Current Created Date and Time
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// Login ID
    /// </summary>
    public string? UpdatedBy { get; set; }

    /// <summary>
    /// Current Modify Date and Time
    /// </summary>
    public DateTime? UpdatedDate { get; set; }

    /// <summary>
    /// Login ID
    /// </summary>
    public string? DeletedBy { get; set; }

    /// <summary>
    /// Current Date and Time
    /// </summary>
    public DateTime? DeletedDate { get; set; }

    /// <summary>
    /// Status (Active, Inactive)
    /// </summary>
    public bool IsDeleted { get; set; }

    public bool? ReqStatus { get; set; }
    public virtual ICollection<TblLabTestPanelAssignment> TblLabTestPanelAssignments { get; } = new List<TblLabTestPanelAssignment>();
}