using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblPanelTestSpecimenTypeAssignment
{
    public int Id { get; set; }

    public int ReqTypeId { get; set; }

    public int? PanelId { get; set; }

    public int? TestId { get; set; }

    public int SpecimenTypeId { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool? Isactive { get; set; }

    public bool IsDeleted { get; set; }
}
