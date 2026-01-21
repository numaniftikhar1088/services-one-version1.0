using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblShipping
{
    public int Id { get; set; }

    public string? ShippingName { get; set; }

    public string? ShippingAddress { get; set; }

    public string? ShippingPhoneNo { get; set; }

    public string? ShippingEmail { get; set; }

    public string? ShippingNote { get; set; }

    public int FacilityId { get; set; }

    public virtual TblFacility Facility { get; set; } = null!;
}
