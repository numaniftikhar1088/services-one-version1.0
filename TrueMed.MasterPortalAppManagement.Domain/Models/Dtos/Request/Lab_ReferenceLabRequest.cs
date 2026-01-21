namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request
{
    public class ReferenceLabRequest
    {
        public LabInformation? LabInformation { get; set; }
    }
  
    public class LabInformation
    {
        public int ReferenceLabId { get; set; }
        public string? LabName { get; set; }
        public string? LabDisplayName { get; set; }
        public string? PortalLogo { get; set; }
        public string? CLIA { get; set; }
        public string? Enter3DigitsProgram { get; set; }
        public string? Enter3DigitsLabCode { get; set; }
        public string? LabType { get; set; }
        public bool? EnableReferenceId { get; set; }
        public bool? Status { get; set; }
        public LabAddress? LabAddress { get; set; }
        public LabDirectorInfo? LabDirectorInfo { get; set; }

    }
    public class LabAddress
    {
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Fax { get; set; }
        public string? Address__1 { get; set; }
        public string? Address__2 { get; set; }
        public string? City1 { get; set; }
        public string? State1 { get; set; }
        public string? ZipCode1 { get; set; }
    }
    public class LabDirectorInfo
    {
        public int LabDirectorId { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? EmailAddress { get; set; }
        public string? Mobile { get; set; }
        public string? Phone { get; set; }
        public string? Address__1 { get; set; }
        public string? Address__2 { get; set; }
        public string? City1 { get; set; }
        public string? State1 { get; set; }
        public string? ZipCode1 { get; set; }
        public string? CapInfoNumber { get; set; }
        public string? NoCapProvider { get; set; }
    }
    public enum LabTypeEnum
    {
        InHouse = 0,
        Reference
    }
}
