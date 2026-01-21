using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblRequisitionScanHistory
{
    public int Id { get; set; }

    public int? RequisitionId { get; set; }

    public string? SpecimenId { get; set; }

    public string? OrderNumber { get; set; }

    public int FacilityId { get; set; }

    public int? PatientId { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public DateTime? Dob { get; set; }

    public string? PhysicianId { get; set; }

    public string? CollectorId { get; set; }

    public DateTime? DateofCollection { get; set; }

    public DateTime? ScanedDate { get; set; }

    public string? ScanedStatus { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
}
