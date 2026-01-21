namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Request
{
    public class FacilityStatusChangedForApprovalRequest
    {
        public int FacilityId { get; set; }
        public string? Status { get; set; }
    }
}
