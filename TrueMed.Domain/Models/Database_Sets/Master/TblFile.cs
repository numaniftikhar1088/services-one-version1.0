using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblFile
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string ContentType { get; set; } = null!;

    public DateTime CreateDate { get; set; }

    public string FilePath { get; set; } = null!;

    public string? Length { get; set; }

    public bool IsDeleted { get; set; }

    public string? UserId { get; set; }
}
