using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class PathDnagroupId
{
    public int Id { get; set; }

    public string GroupId { get; set; }

    public string GroupName { get; set; }

    public string GroupDescription { get; set; }

    public string UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
