namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class GetRequisitionResponse
    {
        public int RequisitionId { get; set; }
        public int FacilityId { get; set; }
        public string? FacilityName { get; set; }
        public string? ProviderId { get; set; }
        public string? ProviderName { get; set; }
        public string? DateOfCollection { get; set; }
        public string? TimeOfCollection { get; set; }
        public string? CollectorId { get; set; }
        public string? CollectorName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? ZipCode { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? County { get; set; }
        public string? Email { get; set; }
        public string? PhoneNo { get; set; }
        public string? MobileNo { get; set; }
        public string? Race { get; set; }
        public string? Ethnicity { get; set; }
        public string? SocialSecurityNumber { get; set; }
        public string? DL_ID_Number { get; set; }
        public string? PassportNumber { get; set; }
        public string? PatientType { get; set; }
        public string? BillingType { get; set; }
        public string? RelationshipToInsured { get; set; }
        public int InsuranceProviderId { get; set; }
        public string? PrimaryPolicyId { get; set; }
        public string? PrimaryGroupId { get; set; }
        public string? InsurancePhone { get; set; }
    }
}
