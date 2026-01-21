namespace TrueMed.PatientManagement.Domain.Models.Dtos.Request
{
    public class SavePatientRequest
    {
        public PatientInformation? PatientInformation { get; set; }
    }
    public class PatientInformation
    {
        public int PatientId { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Ethnicity { get; set; }
        public string? Race { get; set; }
        public string? PatientType { get; set; }
        public string? SocialSecurityNumber { get; set; }
        public string? PassportNumber { get; set; }
        public string? DLIDNumber { get; set; }
        public PatientCurrentAddress? Address { get; set; }
        public List<PatientInsurance>? PatientInsurances { get; set; }
    }
    public class PatientCurrentAddress
    {
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? ZipCode { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? County { get; set; }
        public string? PhoneNumber { get; set; }
        public string? MobileNumber { get; set; }
        public string? Email { get; set; }
        public string? Weight { get; set; }
        public string? Height { get; set; }
        public int Facility { get; set; }
    }
    public class PatientInsurance
    {
        public int Insurance { get; set; }
        public string? InsuranceName { get; set; }
        public int? InsuranceProvider { get; set; }
        public string? InsuranceProviderName { get; set; }
        public string? GroupNumber { get; set; }
        public string? PolicyNumber { get; set; }
        public string? SubscriberRelation { get; set; }
        public string? SubscriberName { get; set; }
        public DateTime? SubscriberDateOfBirth { get; set; }
        public DateTime? AccidentDate { get; set; }
        public string AccidentState { get; set; }
        public string AccidentType { get; set; }
        public string InsurancePhone { get; set; }
        public string BillingType { get; set; }
    }
    public class PatientSearchByFNameLNameRequest
    {
        public int FacilityId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
