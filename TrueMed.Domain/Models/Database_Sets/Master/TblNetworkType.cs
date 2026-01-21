using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblNetworkType
{
    public int NetworkTypeId { get; set; }

    public string? NetworkTypeName { get; set; }

    public bool? IsActive { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool IsDeleted { get; set; }
}
