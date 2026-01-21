using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisition
{
    public string Id { get; set; } = null!;

    public int FacilityId { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime? DeleteDate { get; set; }

    public string? DeletedByUserId { get; set; }
}
