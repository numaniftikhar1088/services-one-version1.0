using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblMarketPlaceIntegrationConfiguration
{
    public string Id { get; set; } = null!;

    public int? FacilityId { get; set; }

    public int? RequisitionId { get; set; }

    public string? MarketplaceId { get; set; }
}
