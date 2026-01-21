namespace TrueMed.RequisitionManagement.Domain.Models.QueryModel
{
    public class ViewRequisitionQueryModel
    {
        public int RequisitionId { get; set; }
        public string? Order { get; set; }
        public string? AccessionNumber { get; set; }
        public int? TabId { get; set; }
        public string? TabName { get; set; }
        public string? RequisitionStatus { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DOB { get; set; }
        public int? PatientID { get; set; }
        public string? RequisitionType { get; set; }
        public string? LabName { get; set; }
        public string? DateOfCollection { get; set; }
        public string? TimeOfCollection { get; set; }
        public string? PhysicianName { get; set; }
        public string? FacilityName { get; set; }
        public string? ReceivedDate { get; set; }
        public string? InsuranceType { get; set; }
        public string? InsuranceProvider { get; set; }

        public string? AddedBy { get; set; }
        public string? AddedDate { get; set; }
        public string? ValidateDate { get; set; }
        public string? AccessionedBy { get; set; }
        public string? AccesionedDate { get; set; }
        public string SortColumn { get; set; }
        public string SortOrder { get; set; }
        public string? JsonArray { get; set; }
    }
}
