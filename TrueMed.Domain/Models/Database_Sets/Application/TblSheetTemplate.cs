using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblSheetTemplate
{
    public int Id { get; set; }

    public string? KeyofTemplate { get; set; }

    public string? TemplateUri { get; set; }
}
