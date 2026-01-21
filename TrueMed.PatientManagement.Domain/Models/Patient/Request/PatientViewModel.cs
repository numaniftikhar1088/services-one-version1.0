using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Request
{
    public class PatientViewModel : Patient.PatientViewModel
    {
        [Required]
        public new string? FirstName { get; set; }
        [Required]
        public new string? LastName { get; set; }
        public new DateTime? DateOfBirth { get; set; }
        [Required]
        public new string? Gender { get; set; }
        [Required]
        public new string? PatientType { get; set; }
        [Required]
        public new PatientAddressInfoViewModel? PatientAddress { get; set; }
    }

    public class PatientAddressInfoViewModel : Patient.PatientAddressInfoViewModel
    {
        [Required]
        public new AddressViewModel? Address { get; set; }

        [Required]
        public new int? FacilityId { get; set; }
    }

    public class UpdatePatientAddressInfoViewModel : PatientAddressInfoViewModel
    {
        [Required]
        public new int? Id { get; set; }
    }

    public class UpdatePatientViewModel : PatientViewModel
    {
        [Required]
        public new int? Id { get; set; }
        [Required]
        public new UpdatePatientAddressInfoViewModel? PatientAddress { get; set; }

    }


    public class PatientValidationByNameAndDateOfBirthViewModel
    {
        [Required]
        public string? FirstName { get; set; }

        public string? MiddleName { get; set; }

        [Required]
        public string? LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}
