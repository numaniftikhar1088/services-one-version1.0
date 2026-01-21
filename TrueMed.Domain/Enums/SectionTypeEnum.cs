namespace TrueMed.Domain.Enums
{
    public enum SectionTypeEnum
    {
        Facility = 2,
        Patient = 3,
        OrderInformation = 4,
        BillingInformation = 5,
        MedicalNecessity = 8,
        DrugAllergy = 9,
        DiagnosisICD10Codes = 12,
        PhysicianSignature = 13,
        PatientSignature = 14,
        SpecimenInformation = 16,
        Requisition = 24,


    }
    public enum RequisitionTypeEnum
    {
        Common,
        InfectiousDisease = 4
    }
}
