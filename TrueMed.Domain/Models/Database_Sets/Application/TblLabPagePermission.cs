using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabPagePermission
{
    public int Id { get; set; }

    public int? MasterPermissionId { get; set; }

    public int? PageId { get; set; }

    public string? PageName { get; set; }

    public string? PermissionName { get; set; }

    public string? PermissionIdentifier { get; set; }

    public bool? IsActive { get; set; }

    public string? CreateBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
