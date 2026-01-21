using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblPatientSignatureInfo
{
    public int Id { get; set; }

    public string? SignatureAssignId { get; set; }

    public string? SignatureInformation { get; set; }

    public DateTime? CreatedTime { get; set; }

    public string? CreatedBy { get; set; }
}
