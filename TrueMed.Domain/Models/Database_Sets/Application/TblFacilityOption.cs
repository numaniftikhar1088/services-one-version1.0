using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblFacilityOption
{
    /// <summary>
    /// Auto Generatd ID/Number
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Option ID / Feature ID linked with Facility
    /// </summary>
    public int? OptionId { get; set; }

    /// <summary>
    /// Facility ID
    /// </summary>
    public int FacilityId { get; set; }

    /// <summary>
    /// Option Value (Checked / Unchecked) 
    /// </summary>
    public string? OptionValue { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public virtual TblFacility Facility { get; set; } = null!;
}
