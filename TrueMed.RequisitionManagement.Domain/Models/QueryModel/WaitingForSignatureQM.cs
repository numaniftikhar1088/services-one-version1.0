namespace TrueMed.RequisitionManagement.Domain.Models.QueryModel
{
    public class WaitingForSignatureQM
    {
        public int RequisitionId { get; set; }
        public string? Status { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? RequisitionTypeId { get; set; }
        public string? RequisitionType { get; set; }
        public string? PhysicianName { get; set; }
        public string? DateOfCollection { get; set; }
        public string? TimeOfCollection { get; set; }
        public string? PhysicianId { get; set; }
    }
}
