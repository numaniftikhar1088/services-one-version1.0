using TrueMed.PatientManagement.Domain.Models.Dtos.Request;

namespace TrueMed.PatientManagement.Domain.Models.QueryModels.Request
{
    public class PatientRequestQM
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? MobileNumber { get; set; }
        public string? Email { get; set; }
    }
    public class PatientByFNameLnameAndDateOfBirthQM  
    {
        public string? Filter { get; set; }
        public int FacilityId { get; set; }
    }
}
