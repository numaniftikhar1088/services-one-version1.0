namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class ViewRequisitionResponse
    {
        public int RequisitionId { get; set; }
        public string? Order { get; set; }
        public string? AccessionNumber { get; set; }
        public int? TabId { get; set; }
        public string? TabName { get; set; }
        public int? RequisitionStatusId { get; set; }
        public string? RequisitionStatus { get; set; }
        public string? StatusColor { get; set; }
        public string? NextStep { get; set; }
        public string? ResultFile { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DOB { get; set; }
        public int? PatientID { get; set; }
        public string? RequisitionType { get; set; }
        public int? RequisitionTypeId { get; set; }
        public string? LabName { get; set; }
        public string? DateOfCollection { get; set; }
        public TimeSpan? TimeOfCollection { get; set; }
        public string? PhysicianName { get; set; }
        public int? FacilityId { get; set; }
        public string? FacilityName { get; set; }
       // public string? ClientName { get; set; }
        public string? ReceivedDate { get; set; }
        public string? InsuranceType { get; set; }
        public string? InsuranceProvider { get; set; }
        public string? AddedBy { get; set; }
        public string? AddedDate { get; set; }
        public string? ValidateDate { get; set; }
        public string? AccessionedBy { get; set; }
        public string? AccesionedDate { get; set; }
        public string? RecordId { get; set; }
        public int? RequisitionOrderId { get; set; }
        public int PortalType { get; set; }
        public string? MissingColumns { get; set; }
        public string? Flag { get; set; }
        public string? TotalCount { get; set; }
    }
}
