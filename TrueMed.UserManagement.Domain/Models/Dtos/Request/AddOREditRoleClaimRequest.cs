namespace TrueMed.UserManagement.Domain.Models.Dtos.Request
{
    public class AddOREditClaimRequest
    {
        public List<AddOREditClaim>? Claims { get; set; }
        public string? UserId { get; set; }
    }
    public class AddOREditClaim
    {
        public int ClaimsId { get; set; }
        public bool? IsChecked { get; set; }
    }
}
