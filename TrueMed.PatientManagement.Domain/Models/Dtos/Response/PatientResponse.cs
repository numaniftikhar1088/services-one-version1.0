using Newtonsoft.Json;
using System.Text.Json.Serialization;
using TrueMed.PatientManagement.Domain.Models.Dtos.Request;

namespace TrueMed.PatientManagement.Domain.Models.Dtos.Response
{
    public class PatientByIdResponse : PatientInformation
    {
    }
    public class GetPatientByFNameLNameAndDateOfBirthResponse : PatientInformation
    {

    }
    public class GetPatientsByFNameLNameResponse
    {
        [JsonPropertyName("PatientId")]
        public int PatientId { get; set; }
        [JsonPropertyName("FirstName")]
        public string FirstName { get; set; }
        [JsonPropertyName("MiddleName")]
        public string? MiddleName { get; set; }
        [JsonPropertyName("LastName")]
        public string? LastName { get; set; }
        [JsonPropertyName("DOB")]
        public DateTime? DateOfBirth { get; set; }
        [JsonPropertyName("Gender")]
        public string? Gender { get; set; }
        [JsonPropertyName("Ethnicity")]
        public string? Ethnicity { get; set; }
        [JsonPropertyName("Phone")]
        public string? PhoneNumber { get; set; }
        [JsonPropertyName("Mobile")]
        public string? MobileNumber { get; set; }
        [JsonPropertyName("Email")]
        public string? Email { get; set; }
        [JsonPropertyName("Weight")]
        public string? Weight { get; set; }
        [JsonPropertyName("Height")]
        public string? Height { get; set; }
        [JsonPropertyName("Race")]
        public string? Race { get; set; }
        [JsonPropertyName("PatientType")]
        public string? PatientType { get; set; }
        [JsonPropertyName("SocialSecurityNumber")]
        public string? SocialSecurityNumber { get; set; }
        [JsonPropertyName("PassPortNumber")]
        public string? PassportNumber { get; set; }
        [JsonPropertyName("PatientDrivingORIDNumber")]
        public string? DLIDNumber { get; set; }
        [JsonPropertyName("Address1")]
        public string? Address1 { get; set; }
        [JsonPropertyName("Address2")]
        public string? Address2 { get; set; }
        [JsonPropertyName("ZipCode")]
        public string? ZipCode { get; set; }
        [JsonPropertyName("City")]
        public string? City { get; set; }
        [JsonPropertyName("State")]
        public string? State { get; set; }
        [JsonPropertyName("Country")]
        public string? Country { get; set; }
        [JsonPropertyName("County")]
        public string? County { get; set; }
        [JsonPropertyName("Insurances")]
        public List<PatientIns> Insurances { get; set; } = new();
    }
    public class PatientIns
    {
        public string BillingType { get; set; }
        public string RelationshipToInsured { get; set; }
        public int? InsuranceProviderId { get; set; }
        public string PrimaryPolicyId { get; set; }
        public string PrimaryGroupId { get; set; }
        public string InsurancePhone { get; set; }
        public string SubscriberName { get; set; }
        public DateTime? SubscriberDob { get; set; }
        public DateTime? AccidentDate { get; set; }
        public string AccidentType { get; set; }
        public string AccidentState { get; set; }

    }

}
