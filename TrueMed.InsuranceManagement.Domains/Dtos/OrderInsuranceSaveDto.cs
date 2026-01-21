namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class OrderInsuranceSaveDto
    {
        public int ReqPatInsId { get; set; }
        public int? RequisitionId { get; set; }
        public int? InsuranceId { get; set; }
        public string? Relation { get; set; }
        public int? InsuranceProviderId { get; set; }
        public string? InsuranceType { get; set; }
        public string? GroupNumber { get; set; }
        public string? PolicyId { get; set; }
        public string? InsurancePhoneNumbr { get; set; }
        public DateTime? AccidentDate { get; set; }
        public string? AccidentType { get; set; }
        public int? AccidentState { get; set; }
        //public string CreatedBy { get; set; } = null!;
        //public DateTime CreatedDate { get; set; }
        //public string? UpdatedBy { get; set; }
        //public DateTime? UpdatedDate { get; set; }
        //public string? DeletedBy { get; set; }
        //public DateTime? DeletedDate { get; set; }
        //public bool IsDeleted { get; set; }


    }
}
