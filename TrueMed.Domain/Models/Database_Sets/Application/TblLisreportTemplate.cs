using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLisreportTemplate
{
    public int Id { get; set; }

    public string? TemplateName { get; set; }

    public string? TemplateDisplayName { get; set; }

    public string? TemplateUrl { get; set; }

    public int? ReqTypeId { get; set; }
}
