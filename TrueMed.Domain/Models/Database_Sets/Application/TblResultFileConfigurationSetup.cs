using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblResultFileConfigurationSetup
{
    public int Id { get; set; }

    public int? LabId { get; set; }

    public bool? CalculationOnCt { get; set; }

    public bool? CalculationOnCtMean { get; set; }

    public bool? CalculationOnCtSd { get; set; }

    public bool? CalculationOnAmpScore { get; set; }

    public bool? CalculationOnCqConf { get; set; }

    public int? PharmDoption { get; set; }
}
