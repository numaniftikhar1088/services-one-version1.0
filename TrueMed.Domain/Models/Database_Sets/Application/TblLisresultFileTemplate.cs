using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLisresultFileTemplate
{
    public int TemplateId { get; set; }

    public string? TemplateName { get; set; }

    public int? LabId { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
}
