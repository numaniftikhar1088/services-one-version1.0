using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblResultFileTemplateSetup
{
    public int Id { get; set; }

    public string TemplateName { get; set; }

    public int? LabId { get; set; }

    public string SystemCellName { get; set; }

    public string CustomCellName { get; set; }

    public int? CustomCellOrder { get; set; }

    public bool IsDeleted { get; set; }

    public string CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
}
