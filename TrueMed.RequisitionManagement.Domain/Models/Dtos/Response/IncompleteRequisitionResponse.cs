namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class IncompleteRequisitionResponse
    {
        public int RequisitionId { get; set; }
        public string? Order { get; set; }
        public string? Status { get; set; }
        public string? StatusColor { get; set; }
        public string? MissingInfo { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DateOfBirth { get; set; }
        public int? RequisitionTypeId { get; set; }
        public string? RequisitionType { get; set; }
        public string? PhysicianName { get; set; }
        public string? ClientName { get; set; }
        public string? DateOfCollection { get; set; }
        public string? TimeOfCollection { get; set; }
        public string? AddedBy { get; set; }
    }
}
