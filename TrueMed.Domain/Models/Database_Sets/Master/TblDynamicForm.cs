using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblDynamicForm
{
    public string Key { get; set; } = null!;

    public DateTime CreateDate { get; set; }

    public string? Form { get; set; }

    public string? Description { get; set; }

    public string? RawForm { get; set; }
}
