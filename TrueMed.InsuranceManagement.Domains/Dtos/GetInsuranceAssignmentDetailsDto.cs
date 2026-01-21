namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class GetInsuranceAssignmentDetailsDto
    {
        public int? InsuranceId { get; set; }
        public int ProviderID { get; set; }
        public int InsuranceAssignmentId { get; set; }
        public int OptionId { get; set; }
        public string? OptionName { get; set; }
        public string? OptionValue { get; set; }
        public string? ProviderName { get; set; }
        public string? DisplayName { get; set; }
        public string? TMITCode { get; set; }
        public string? InsuranceName { get; set; }
        public string? InsuranceType { get; set; }
        public bool? Status { get; set; }
    }
}
