using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.PatientManagement.Domain.Models.Patient
{
    public partial class PatientViewModel
    {
        public int? Id { get; set; }
        public string FirstName { get; set; } = String.Empty;
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = String.Empty;
        public DateTime DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? SocialSecurityNumber { get; set; }
        public string? Ethinicity { get; set; }
        public string? Race { get; set; }
        public string? PassportNumber { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? DLIDNumber { get; set; }
        public string? PatientType { get; set; }
        public PatientAddressInfoViewModel? PatientAddress { get; set; }
    }

    public class PatientAddressInfoViewModel
    {
        public int? Id { get; set; }
        public AddressViewModel? Address { get; set; }
        public string? County { get; set; }
        public string? LandPhone { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public string? Height { get; set; }
        public string? Weight { get; set; }
        public int? FacilityId { get; set; }
    }

    public enum Gender
    {
        Male,
        Female,
        Unknown
    }
}
