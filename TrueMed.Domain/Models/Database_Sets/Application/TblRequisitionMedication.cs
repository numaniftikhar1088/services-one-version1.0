using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionMedication
{
    /// <summary>
    /// Auto Generated ID/Number
    /// </summary>
    public int RequisitionMedId { get; set; }

    /// <summary>
    /// Requisition Group ID (tblRequisitionGroupInfo Table)
    /// </summary>
    public int RequisitionGroupId { get; set; }

    /// <summary>
    /// Requisition ID (tblRequisitionMaster / tblRequisitionGroupInfo Tables)
    /// </summary>
    public int? RequisitionId { get; set; }

    /// <summary>
    /// Requisition Type ID (tblRequisitionType / tblRequisitionGroupInfo Table)
    /// </summary>
    public int? ReqTypeId { get; set; }

    /// <summary>
    /// Medication Class
    /// </summary>
    public string? MedicaltionClass { get; set; }

    /// <summary>
    /// Medication Type
    /// </summary>
    public string? MedicationType { get; set; }

    /// <summary>
    /// Medication Name
    /// </summary>
    public string? MedicationName { get; set; }

    /// <summary>
    /// Dosage
    /// </summary>
    public string? Dosage { get; set; }

    /// <summary>
    /// Consideration
    /// </summary>
    public string? Consideration { get; set; }

    /// <summary>
    /// Route
    /// </summary>
    public string? Route { get; set; }

    /// <summary>
    /// Drug Bank ID
    /// </summary>
    public string? DrugBankId { get; set; }

    public virtual TblRequisitionOrder RequisitionGroup { get; set; } = null!;
}
