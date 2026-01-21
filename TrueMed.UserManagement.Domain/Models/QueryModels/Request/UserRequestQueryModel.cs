using TrueMed.UserManagement.Domain.Enums;

namespace TrueMed.UserManagement.Domain.Models.QueryModels.Request
{
    public class UserRequestQueryModel
    {
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? AdminEmail { get; set; }
        public string? AdminType { get; set; }
        public string? UserGroup { get; set; }
        public bool? Status { get; set; }
    }
}
