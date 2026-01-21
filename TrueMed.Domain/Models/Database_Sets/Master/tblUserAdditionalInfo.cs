using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblUserAdditionalInfo
{
    public string UserId { get; set; } = null!;

    public bool? IsReferenceLabUser { get; set; }

    public string? ReferenceLabName { get; set; }

    public string? Npi { get; set; }

    public string? StateLicenseNo { get; set; }

    //public virtual TblUser? TblUser { get; set; }
}
