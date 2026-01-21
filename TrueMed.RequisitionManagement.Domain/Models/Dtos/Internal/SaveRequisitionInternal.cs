namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Internal
{
    public class SaveRequisitionInternal
    {
        public CommonReq? CommonReq { get; set; }
        public InfectiousDiseaseReq? InfectiousDiseaseReq { get; set; }

    } 
    public class CommonReq
    {
        public FacilitySection? Facility { get; set; }
        public OrderInfoSection? OrderInformation { get; set; }
        public PatientSection? PatientSection { get; set; }
        public List<BillingInfoSection>? BillingInformations { get; set; } = new();
        public PatientSignatureSection? PatientSignature { get; set; }
        public PhysicianSignatureSection? PhysicianSignature { get; set; }
    }
    public class InfectiousDiseaseReq
    {
        public DrugAllergySection? DrugAllergy { get; set; }
        public DiagnosisICD10CodeSection? DiagnosisICD10Code { get; set; }
        public SpecimenInformationSection? SpecimenInformation { get; set; }
        public MedicalNecessitySection? MedicalNecessity { get; set; }
    }
    public class FacilitySection
    {
        public int? FacilityId { get; set; }
        public string? PhysicianId { get; set; }
    }
    public class OrderInfoSection
    {
        public string? OrderType { get; set; }
        public DateTime? DateofCollection { get; set; }
        public TimeSpan? TimeofCollection { get; set; }
        public DateTime? DateReceived { get; set; }
        public string? Mileage { get; set; }
        public string? CollectorId { get; set; }
        public string? CollectedBy { get; set; }
        public string? StatOrder { get; set; }
    }
    public class PatientSection
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? Dob { get; set; }
        public string? Gender { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? ZipCode { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? County { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Mobile { get; set; }
        public string? Race { get; set; }
        public string? Ethnicity { get; set; }
        public string? SocialSecurity { get; set; }
        public string? PatientDlId { get; set; }
        public string? PassPort { get; set; }
        public string? PatientType { get; set; }
        public string? Height { get; set; }
        public string? Weight { get; set; }
    }
    public class BillingInfoSection
    {
        public string? InsuranceType { get; set; }
        public string? Relation { get; set; }
        public int? InsuranceProviderId { get; set; }
        public string? PolicyId { get; set; }
        public string? GroupNumber { get; set; }
        public string? SubscriberName { get; set; }
        public DateTime? SubscriberDob { get; set; }
        public string? InsurancePhoneNumbr { get; set; }
        public string? PhotoForInsuranceURL { get; set; }
        public string? PhotoForDemoURL { get; set; }
    }
    public class DrugAllergySection
    {
        public string? DrugCode { get; set; } 
    }
    public class PatientSignatureSection
    {
        public string? PatientSignatureUrlpath { get; set; }
    }
    public class PhysicianSignatureSection
    {
        public string? PhysicianSignatureUrlpath { get; set; }
    }
    public class DiagnosisICD10CodeSection
    {
        public string? Icd10code { get; set; }
        public string? Icd10description { get; set; }
    }
    public class SpecimenInformationSection
    {
        public string? AccessionNumber { get; set; }
        public int? SpecimenTypeId { get; set; }
    }
    public class MedicalNecessitySection
    {
        public bool? ExposuretoCovid19 { get; set; }
        public int NumberofDayCovid { get; set; }
        public bool? SignandSymptom { get; set; }
        public int NumberofDaysSmptom { get; set; }
        public bool? RecommendedTest { get; set; }
        public string? Others { get; set; }
    }
}
