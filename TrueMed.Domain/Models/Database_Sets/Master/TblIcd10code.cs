using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblIcd10code
{
    public int Icd10id { get; set; }

    public string Icd10code { get; set; } = null!;

    public string? Description { get; set; }

    public bool? Icd10status { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool IsDeleted { get; set; }
}
