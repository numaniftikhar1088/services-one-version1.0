using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblLabMenu
{
    public int Id { get; set; }

    public int? LabId { get; set; }

    public int? RoleId { get; set; }

    public int? ModuleId { get; set; }

    public int? MenuId { get; set; }

    public string? DisplayName { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdateBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
