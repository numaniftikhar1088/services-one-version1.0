using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblInsTestAssignment
{
    public int Id { get; set; }

    public int? TestId { get; set; }

    public int? InsuranceProviderId { get; set; }

    public string? NetworkType { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool IsDeleted { get; set; }

    public virtual TblInsuranceProvider? InsuranceProvider { get; set; }

    public virtual TblTest? Test { get; set; }
}
