using System.Text.Json.Serialization;
using TrueMed.PatientManagement.Domain.Models.Dtos.Request;

namespace TrueMed.PatientManagement.Domain.Models.QueryModels.Response
{
    public class PatientResponseQM : PatientInformation
    {
    }
    public class PatientResponseByFNameLnameAndDateOfBirthQM
    {
        [JsonPropertyName("Facility")]
        public int Facility { get; set; }
        [JsonPropertyName("PatientId")]
        public int PatientId { get; set; }
        [JsonPropertyName("FirstName")]
        public string? FirstName { get; set; }
        [JsonPropertyName("LastName")]
        public string? LastName { get; set; }
        [JsonPropertyName("DOB")]
        public DateTime DateOfBirth { get; set; }
        [JsonPropertyName("Gender")]
        public string? Gender { get; set; }
        [JsonPropertyName("Address1")]
        public string? Address1 { get; set; }
        [JsonPropertyName("City")]
        public string? City { get; set; }
        [JsonPropertyName("State")]
        public string? State { get; set; }
        [JsonPropertyName("ZipCode")]
        public string? ZipCode { get; set; }
        [JsonPropertyName("County")]
        public string? Country { get; set; }
        [JsonPropertyName("Email")]
        public string? Email { get; set; }
        [JsonPropertyName("Phone")]
        public string? Phone { get; set; }
        [JsonPropertyName("Mobile")]
        public string? Mobile { get; set; }
        [JsonPropertyName("Race")]
        public string? Race { get; set; }
        [JsonPropertyName("Ethnicity")]
        public string? Ethnicity { get; set; }
        [JsonPropertyName("SocialSecurity")]
        public string? SocialSecurity { get; set; }
        [JsonPropertyName("PatientType")]
        public string? PatientType { get; set; }
        [JsonPropertyName("PatientDL/ID")]
        public string? PatientDLID { get; set; }
        [JsonPropertyName("PassPort")]
        public string? PassPort { get; set; }
        [JsonPropertyName("Weight")]
        public string? Weight { get; set; }
        [JsonPropertyName("Height")]
        public string? Height { get; set; }
    }
}
