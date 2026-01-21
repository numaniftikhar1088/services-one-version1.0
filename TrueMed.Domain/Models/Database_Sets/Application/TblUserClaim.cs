using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblUserClaim
{
    public string UserId { get; set; } = null!;

    public int ClaimId { get; set; }

    public int? ModuleId { get; set; }

    public int? PageId { get; set; }

    public bool? IsChecked { get; set; }

    public string? PagePermissions { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
