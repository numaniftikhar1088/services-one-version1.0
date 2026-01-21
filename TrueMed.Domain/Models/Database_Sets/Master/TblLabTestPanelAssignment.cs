using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblLabTestPanelAssignment
{
    public int Id { get; set; }

    public int? PanelId { get; set; }

    public int? TestId { get; set; }

    public int? LabId { get; set; }

    public int? ReqTypeId { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool IsDeleted { get; set; }

    public virtual TblLab? Lab { get; set; }

    public virtual TblPanel? Panel { get; set; }

    public virtual TblRequisitionType? ReqType { get; set; }

    public virtual TblTest? Test { get; set; }
}
