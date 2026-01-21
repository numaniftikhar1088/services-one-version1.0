using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblPanelSpecimenTypeAssignment
{
    public int Id { get; set; }

    public int? PanelTestAssignmentId { get; set; }

    public int? PanelId { get; set; }
}
