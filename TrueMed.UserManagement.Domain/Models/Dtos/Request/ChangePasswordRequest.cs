namespace TrueMed.UserManagement.Domain.Models.Dtos.Request
{
    public class ChangePasswordRequest
    {
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
        public string? UserId { get; set; }
    }
}
