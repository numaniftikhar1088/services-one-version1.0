using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblUserViewRequisition
{
    public int Id { get; set; }

    public string? UserId { get; set; }

    public int? ViewRequisitionId { get; set; }

    public int? ColumnOrder { get; set; }

    public int? LabId { get; set; }
}
