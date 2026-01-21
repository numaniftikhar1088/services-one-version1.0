using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblCompendiumGroupPanelsAssignment
{
    public int Id { get; set; }

    public int? GroupId { get; set; }

    public int? PanelId { get; set; }

    public string? PanelDisplayName { get; set; }

    public int? DisplayTypeId { get; set; }

    public int? SortOrder { get; set; }

    public bool? IsActive { get; set; }

    public bool IsDeleted { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public string? OrderCode { get; set; }

    public string? ResultCode { get; set; }
}
