namespace TrueMed.UserManagement.Domain.Models.Dtos.Request
{
    public class ResetPasswordRequest
    {
        //public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
        public string? UserId { get; set; }
    }
}
