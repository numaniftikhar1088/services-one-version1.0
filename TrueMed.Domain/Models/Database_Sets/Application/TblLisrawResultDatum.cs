using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLisrawResultDatum
{
    public int RawDataId { get; set; }

    public string Well { get; set; }

    public string WellPosition { get; set; }

    public string Omit { get; set; }

    public string SampleName { get; set; }

    public string TargetName { get; set; }

    public string Task { get; set; }

    public string Reporter { get; set; }

    public string Quencher { get; set; }

    public string Ct { get; set; }

    public string CtMean { get; set; }

    public string CtSd { get; set; }

    public string Quantity { get; set; }

    public string QuantityMean { get; set; }

    public string QuantitySd { get; set; }

    public string AutomaticCtThreshold { get; set; }

    public string CtThreshold { get; set; }

    public string AutomaticBaseline { get; set; }

    public string BaselineStart { get; set; }

    public string BaselineEnd { get; set; }

    public string Comments { get; set; }

    public string Yintercept { get; set; }

    public string Rsuperscript2 { get; set; }

    public string Slope { get; set; }

    public string AmpScore { get; set; }

    public string CqConf { get; set; }

    public string AmpStatus { get; set; }

    public string OffScale { get; set; }

    public string ExpFail { get; set; }

    public string Noise { get; set; }

    public string Spike { get; set; }

    public string CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
}
