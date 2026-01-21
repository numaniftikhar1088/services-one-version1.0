using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblFile
{
    public string Id { get; set; } = null!;

    public string? Name { get; set; }

    public string? FileType { get; set; }

    public string? FilePath { get; set; }

    public int? ParentId { get; set; }

    public string? ChildId { get; set; }

    public string? ContentType { get; set; }

    public string? Length { get; set; }

    public int LabId { get; set; }

    public int FacilityId { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreateDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual TblFacility Facility { get; set; } = null!;
}
