using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblPage
{
    public int Id { get; set; }

    public DateTime CreateDate { get; set; }

    public string? CreateBy { get; set; }
}
