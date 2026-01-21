using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblViewRequisitionColumn
{
    public int Id { get; set; }

    public string? ColumnLabel { get; set; }

    public string? ColumnName { get; set; }

    public string? ColumnValue { get; set; }

    public bool? IsShowOnUi { get; set; }

    public string? FilterColumns { get; set; }

    public string? FilterColumnsType { get; set; }

    public bool? IsDefaultSelected { get; set; }

    public string? ColumnKey { get; set; }
}
