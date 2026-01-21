using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabRequisitionType
{
    /// <summary>
    /// Auto Generated ID
    /// </summary>
    public int ReqTypeId { get; set; }

    /// <summary>
    /// Requisition Type
    /// </summary>
    public string? RequisitionType { get; set; }

    /// <summary>
    /// Requisition Type Name like Infectious Disease, Blood, Tox etc.
    /// </summary>
    public string? RequisitionTypeName { get; set; }

    public string? RequisitionColor { get; set; }

    public int MasterRequisitionTypeId { get; set; }

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
    public bool? IsDeleted { get; set; }

    public bool? IsActive { get; set; }

    public bool IsSelected { get; set; }

    public int LabId { get; set; }

    public virtual ICollection<TblLabAssignment> TblLabAssignments { get; } = new List<TblLabAssignment>();

    public virtual ICollection<TblLabRequisitionTypeWorkflowStatus> TblLabRequisitionTypeWorkflowStatuses { get; } = new List<TblLabRequisitionTypeWorkflowStatus>();
}
