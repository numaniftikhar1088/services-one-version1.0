
using TrueMed.Domain.Models.Identity;
using TrueMed.FacilityManagement.Domain.Enums;

namespace TrueMed.FacilityManagement.Domain.Models.Facility.DTOs
{
    #region Facility Save ViewModels
    public class FacilityViewModel
    {
        public FacilityViewModel() 
        {
            GeneralInfo.AccountActivationType = ProviderInfo.ActivationType;
        }
        public General GeneralInfo { get; set; } = new();
        public ContactInformation ContactInfo { get; set; } = new();
        public CriticalInformation CriticalInfo { get; set; } = new();
        public ProviderInformation? ProviderInfo { get; set; } = new();
        public ShippingInformation ShippingInfo { get; set; } = new();
        public List<FacilityOptions>? FacilityOpt { get; set; }
        public List<UploadFiles>? Files { get; set; } = new();
        public int? TemplateId { get; set; }
        //public AssignLab AssignLabInfo { get; set; } = new();   

    }
    public class General
    {
        public int FacilityId { get; set; }
        public string? FacilityName { get; set; }
        public string? FacilityStatus { get; set; }
        public string? ZipCode { get; set; }
        public string? FacilityPhone { get; set; }
        public string? FacilityFax { get; set; }
        public string? FacilityWebsite { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? CreateBy { get; set; }
        internal AccountActivationTypeEnum? AccountActivationType { get; set; }
        public AddressViewModel? AddressView { get; set; } = new();
        public bool? IsApproved { get; set; }
    }
    public class ContactInformation
    {
        public string? ContactFirstName { get; set; }
        public string? ContactLastName { get; set; }
        public string? ContactPrimaryEmail { get; set; }
        public string? ContactPhone { get; set; }
    }
    public class CriticalInformation
    {
        public string? CriticalFirstName { get; set; }
        public string? CriticalLastName { get; set; }
        public string? CriticalEmail { get; set; }
        public string? CriticalPhoneNo { get; set; }
    }
    public class ProviderInformation
    {
        public string? PhysicianFirstName { get; set; }
        public string? PhysicianLastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? NPI { get; set; }
        public string? StateLicense { get; set; }
        public AccountActivationTypeEnum ActivationType { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }



    }
    public class ShippingInformation
    {
        public string? ShippingName { get; set; }
        public string? ShippingAddress { get; set; }
        public string? ShippingPhoneNumber { get; set; }
        public string? ShippingEmail { get; set; }
        public string? ShippingNote { get; set; }

    }
    public class FacilityOptions
    {
        //public int Id { get; set; }
        public int? OptionId { get; set; }
        //public int? FacilityId { get; set; }
        public string? OptionValue { get; set; }

    }
    public class UploadFiles
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? FilePath { get; set; }
        public string? FileLenght { get; set; }
        public int LabId { get; set; }
    }
    #endregion
    public class FacilityStatusChange
    {
        public int FacilityId { get; set; }
        public string Status { get; set; }
    }
    public class FacilityAssignUserViewModel
    {
        public int FacilityId { get; set; }
        public string? UserId { get; set; } = null!;
        public string? Username { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNo { get; set; }
        public string? LabUser { get; set; }

    }
    public class FacilityAgainstUser
    {
        public int FacilityId { get; set; }
        public string? FacilityName { get; set; }
        public string? Address { get; set; }
        public string? Address2 { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
    }
    public class FacilityAgainstUserSelectedField
    {
        public int FacilityId { get; set; }
        public string? UserId { get; set; }
    }
    public class ChangeFacilityStatusByBulk
    {
        public List<int> FacilityIds { get; set; }
        public string? Status { get; set; }
    }
}
