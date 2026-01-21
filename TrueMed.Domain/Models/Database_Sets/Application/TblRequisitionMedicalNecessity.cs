using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionMedicalNecessity
{
    public int ReqMedNecessityId { get; set; }

    public int RequisitionGroupId { get; set; }

    public int RequisitionId { get; set; }

    public int? ReqTypeId { get; set; }

    public bool ExposuretoCovid19 { get; set; }

    public int? NumberofDayCovid { get; set; }

    public bool SignandSymptom { get; set; }

    public int? NumberofDaysSymptom { get; set; }

    public bool RecommendedTest { get; set; }

    public string? Others { get; set; }
}
