using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblFacilityReportTemplate
{
    public int Id { get; set; }

    public int FacilityId { get; set; }

    public int TemplateId { get; set; }

    public virtual TblFacility Facility { get; set; } = null!;
}
