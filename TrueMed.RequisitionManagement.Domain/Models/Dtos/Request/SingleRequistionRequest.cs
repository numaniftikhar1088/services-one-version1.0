namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class SaveSingleRequistionRequest
    {
        public int RequisitionId { get; set; }
        public string? OrderNumber { get; set; }
        public int? FacilityId { get; set; }
        public int? PatientId { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? ZipCode { get; set; }
        public string? County { get; set; }
        public string? LandPhone { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public int? PhysicianId { get; set; }
        public int? CollectorId { get; set; }
        public DateTime? CollectionDate { get; set; }
        public string? RequisitionStatus { get; set; }
    }
}
