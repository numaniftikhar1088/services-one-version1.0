using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionDrugAllergyCode
{
    public int RequisitionDrugId { get; set; }

    public int RequisitionOrderId { get; set; }

    public int RequisitionId { get; set; }

    public int? ReqTypeId { get; set; }

    public string? DrugCode { get; set; }

    public string? DrugAllergiesDescription { get; set; }
}
