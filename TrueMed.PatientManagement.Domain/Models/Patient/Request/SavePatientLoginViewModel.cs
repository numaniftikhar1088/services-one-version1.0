using System.ComponentModel.DataAnnotations;
namespace TrueMed.PatientManagement.Domain.Models.Patient.Request
{
    public class SavePatientLoginViewModel
    {

        public int PatientLoginId { get; set; }
        [Required]
        public int PatientId { get; set; }
        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string UserName { get; set; } = null!;
        [Required]
        public string? LoginPassword { get; set; }
        [Required]
        public string? Mobile { get; set; }
    }
}
