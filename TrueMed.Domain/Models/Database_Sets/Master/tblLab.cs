using TrueMed.Domain.Helpers;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblLab
{
    public int LabId { get; set; }

    public string? LabKey { get; set; }

    public string? LaboratoryName { get; set; }

    public string? DisplayName { get; set; }

    public string? Address1 { get; set; }

    public string? Address2 { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? ZipCode { get; set; }

    public string? Description { get; set; }

    public string? MobileNumber { get; set; }

    public string? PhoneNumber { get; set; }

    public string? FaxNumber { get; set; }

    public string? Cliano { get; set; }

    public string? Email { get; set; }

    public string? PortalLogo { get; set; }

    public string? ResultsHeader { get; set; }

    public string? RequisitionHeader { get; set; }

    public string? MarketingLogo { get; set; }

    public string? PatientPortalUrl { get; set; }

    public DateTime CreateDate { get; set; }

    public bool? IsActive { get; set; }

    public string? CriticalContactName { get; set; }

    public string? CriticalContactPhone { get; set; }

    public bool? IsDeleted { get; set; }

    public bool IsReferenceLab { get; set; }

    public string? LabUrl { get; set; }

    public int? CopyFromLab { get; set; }

    public string? Dbname { get; set; }

    public string? CreatedBy { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool? IsDeleteAssignedReferenceLabs { get; set; }

    public bool? IsDeletePatients { get; set; }

    public bool? IsDeleteUsers { get; set; }

    public bool? IsDeleteAssignedInsurances { get; set; }

    public bool? IsDeleteFacilities { get; set; }

    public bool? IsDeleteIcd10assignment { get; set; }

    public bool? IsDeleteInsuranceAssignment { get; set; }

    public int? Status { get; set; }

    public string? Enter3DigitsProgram { get; set; }

    public string? Enter3DigitsLabCode { get; set; }

    public short? LabType { get; set; }

    public bool? IsEnableReferenceId { get; set; }

    public virtual ICollection<TblDirectorInformation> TblDirectorInformations { get; } = new List<TblDirectorInformation>();

    public virtual ICollection<TblLabTestPanelAssignment> TblLabTestPanelAssignments { get; } = new List<TblLabTestPanelAssignment>();

    public virtual ICollection<TblLabUser> TblLabUsers { get; } = new List<TblLabUser>();

    //public virtual ICollection<TblUserRole> TblUserRoles { get; } = new List<TblUserRole>();
}
