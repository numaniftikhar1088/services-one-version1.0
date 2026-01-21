using TrueMed.UserManagement.Domain.Enums;

namespace TrueMed.UserManagement.Domain.Models.QueryModels.Response
{
    public class UserResponseQueryModel
    {
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? AdminEmail { get; set; }
        public int? AdminTypeId { get; set; }
        public string? AdminType { get; set; }
        public int UserGroupId { get; set; }
        public string? UserGroup { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool? Status { get; set; }
    }
}
