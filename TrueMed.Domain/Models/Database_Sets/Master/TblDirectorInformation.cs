using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblDirectorInformation
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string? MiddleName { get; set; }

    public string LastName { get; set; } = null!;

    public string EmailAddress { get; set; } = null!;

    public string? Mobile { get; set; }

    public string? Phone { get; set; }

    public string? Address1 { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Address2 { get; set; }

    public string? ZipCode { get; set; }

    public string? CapInfoNumber { get; set; }

    public string? NoCapProvider { get; set; }

    public int? LabId { get; set; }

    public virtual TblLab? Lab { get; set; }
}
