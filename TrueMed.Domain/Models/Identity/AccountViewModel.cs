using TrueMed.Domain.Enums;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.Domain.Models.Identity
{
    namespace Response
    {
        public class UserReponseViewModel
        {
            public string? Id { get; set; }
            public string? FirstName { get; set; }
            public string? MiddleName { get; set; }
            public string? LastName { get; set; }
            public DateTime? DateOfBirth { get; set; }
            public string? Email { get; set; }
            public string? UserName { get; set; }
            public string? Gender { get; set; }
            public string? Mobile { get; set; }
            public string? Role { get; set; }
            public int? RoleType { get; set; }
            public string? RoleTypeName { get; set; }
            public string? Phone { get; set; }
            public UserType? UserType { get; set; }
            public string? ProfileImage { get; set; }
            public bool? IsActive { get; set; }
            public bool? IsDirector { get; set; }
            public DateTime? CreateDate { get; set; }
            public bool? TwoFactorAuth { get; set; }
            public int[]? LabIds { get; set; }
            public AccountActivationType AccountActivationType
            {
                get
                {
                    return string.IsNullOrWhiteSpace(Email) ?
                        AccountActivationType.Username : AccountActivationType.Username;
                }
            }
            public AddressViewModel AddressView { get; set; } = new();
            public UserAdditionalInfo? AdditionalInfo { get; set; } = new();

            public class UserAdditionalInfo
            {
                public string? NPI { get; set; }
                public string? StateLicenseNumber { get; set; }
                public string? ReferenceLabName { get; set; }
                public int? ReferenceLabId { get; set; }
                public bool? IsReferenceLab { get; set; }
            }
        }
        public class UserBrief_ViewModel
        {
            public string? Id { get; set; }
            public string? Name { get; set; }
            public string? Email { get; set; }
        }

    }
}
