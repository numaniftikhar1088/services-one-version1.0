namespace TrueMed.UserManagement.Domain.Models.Dtos.Request
{
    public class FacilityUserCreateRequest
    {
        public string? Id { get; set; }
        //public int UserTypeId { get; set; }
        public int AdminTypeId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? NPI { get; set; }
        public string? StateLicense { get; set; }
        public int AccountType { get; set; }
        public string? PhoneNo { get; set; }
        public string? Gender { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public string? UserTitle { get; set; }
        public int userGroupId { get; set; }
        public int[]? Facilities { get; set; }
    }
}
