using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblReportComment
{
    public int Id { get; set; }

    public int? TemplateId { get; set; }

    public int? LabId { get; set; }

    public string? FooterString { get; set; }

    public bool? IsActive { get; set; }
}
