using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLisresultDatum
{
    public int Id { get; set; }

    public int? QuantFileId { get; set; }

    public string QuantFileName { get; set; }

    public string FileType { get; set; }

    public int LabId { get; set; }

    public int RequisitionTypeId { get; set; }

    public string AccessionNumber { get; set; }

    public int? PanedId { get; set; }

    public string PanelName { get; set; }

    public int? TestId { get; set; }

    public string TestName { get; set; }

    public string Result { get; set; }

    public string CombinedResult { get; set; }

    public string CtMeans { get; set; }

    public decimal? Ampscore { get; set; }

    public decimal? Crtsd { get; set; }

    public decimal? CqConf { get; set; }

    public string Qualitative { get; set; }

    public bool? IsReRun { get; set; }

    public string CtmeansRerun { get; set; }

    public string AntibioticClass { get; set; }

    public string EstMicrobialLoad { get; set; }

    public string PharmdInterpretation { get; set; }

    public string OrganismType { get; set; }

    public int? DisplayOrder { get; set; }

    public bool? IsControl { get; set; }

    public string CorrectedValue { get; set; }

    public int? RequisitionId { get; set; }

    public int? RecordId { get; set; }

    public string CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
