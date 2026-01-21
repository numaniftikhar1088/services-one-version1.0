using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.Domain.Model.Identity
{
    public class EnconterBase
    {
        public string? Id { get; set; } = Guid.NewGuid().ToString();
    }
    public class ApplicationUserBase : EnconterBase
    {
        public string? ProfileImageUrl { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Email { get; set; }
        public string? Mobile { get; set; }
        public UserType UserType { get; set; }
        public bool? TwoFactorAuth { get; set; }
        public bool? isActive { get; set; }
        public string? AdminType { get; set; }
        public int? UserAccountType { get; set; }
        public bool IsFacilityUser { get; set; }
    }
    public class ApplicationUser : ApplicationUserBase
    {
        public ApplicationUser()
        {
            Address = new AddressViewModel();
        }
        public string? Phone { get; set; }
        public DateTime UpdatedDate { get; set; }
        public AddressViewModel Address { get; set; }
        public List<int>? LabIds { get; set; } = new();
    }

    public enum AccountActivationType
    {
        Username,
        Email
    }

    public class UserAdditionalInfo : EnconterBase
    {
        public bool IsReferenceLabUser { get; set; }
        public string? ReferenceLabName { get; set; }
        public string? NPI { get; set; }
        public string? StateLicenseNo { get; set; }
    }
}
