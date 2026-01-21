using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblModule
{
    public int ModuleId { get; set; }

    public string CreateBy { get; set; } = null!;

    public DateTime CreateDate { get; set; }
}
