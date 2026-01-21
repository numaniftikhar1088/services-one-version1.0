using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblFacilityUser
{
    public string UserId { get; set; } = null!;

    public int FacilityId { get; set; }

    public string? MasterUserId { get; set; }

    public string? RefrenceLabId { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime CreatedTime { get; set; }
}
