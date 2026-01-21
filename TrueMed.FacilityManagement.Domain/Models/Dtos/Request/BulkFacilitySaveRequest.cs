namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Request
{
    public class BulkFacilitySaveRequest
    {
        public string? FacilityName { get; set; }
        public string? FacilityPhone { get; set; }
        public string? FacilityFax { get; set; }
        public string? FacilityAddress { get; set; }
        public string? FacilityAddress2 { get; set; }
        public string? FacilityCity { get; set; }
        public string? FacilityState { get; set; }
        public string? FacilityZipCode { get; set; }
        public string? PrimaryContactFirstName { get; set; }
        public string? PrimaryContactLastName { get; set; }
        public string? PrimaryContactEmail { get; set; }
        public string? PrimaryContactPhone { get; set; }
        public string? CriticalContactFirstName { get; set; }
        public string? CriticalContactLastName { get; set; }
        public string? CriticalContactEmail { get; set; }
        public string? CriticalContactPhone { get; set; }
        public string? ProviderFirstName { get; set; }
        public string? ProviderLastName { get; set; }
        public string? ProviderPhone { get; set; }
        public string? ProviderNPI { get; set; }
        public string? PhysicianStateLicense { get; set; }
        public string? ShippingName { get; set; }
        public string? ShippingAddress { get; set; }
        public string? ShippingPhoneNumber { get; set; }
        public string? ShippingEmail { get; set; }
        public string? ShippingNote { get; set; }

    }
}
