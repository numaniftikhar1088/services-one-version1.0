using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class ToxPanelTest
{
    public int Id { get; set; }

    public int? LabId { get; set; }

    public int? PanelId { get; set; }

    public int? PanelGroupId { get; set; }

    public string? PanelGroupCode { get; set; }

    public string? LabReferenceCode { get; set; }

    public string? SubPanel { get; set; }

    public string? CommonTestName { get; set; }

    public string? SystemTestName { get; set; }

    public string? DrugClassName { get; set; }

    public string? LabTestName { get; set; }

    public string? IntegrationType { get; set; }

    public string? PanelCode { get; set; }

    public string? PanelType { get; set; }

    public string? RequisitionType { get; set; }

    public string? SpecimentType { get; set; }

    public string? CuttOffValues { get; set; }

    public string? UpperLimit { get; set; }

    public string? Units { get; set; }

    public string? Loinc { get; set; }

    public string? Cptcodes { get; set; }

    public string? AssociatedMedications { get; set; }

    public bool? IsActive { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool? IsSpecimenValidatyTest { get; set; }

    public string? EdenOrderTestCode { get; set; }

    public string? EdenResultTestCode { get; set; }

    public string? ReceivedBy { get; set; }

    public string? PerformingLab { get; set; }

    public string? ReqId { get; set; }

    public int? TestAssignmentId { get; set; }

    public string? DrugClass { get; set; }
}
