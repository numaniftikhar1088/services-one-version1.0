using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.File;
using TrueMed.FacilityManagement.Domain.Models.Facility.DTOs;

namespace TrueMed.FacilityManagement.Domain.Models.Facility.Response
{

    public class FacilityBaseViewModel
    {
        public DateTime? AddedDate { get; set; }
        public int? FacilityId { get; set; }
        public string? State { get; set; }
        public string FacilityEmail { get; set; }
        public string? FacilityName { get; set; }
        public string ContactLastName { get; set; }
        public string ContactFirstName { get; set; }
        public string? address1 { get; set; }
    }

    public class FacilityBulkOrdersViewModel
    {
        [Required]
        public ICollection<FacilityViewModel>? Orders { get; set; }
        public string? Report { get; set; }
    }

    public class FacilityUserViewModel
    {
        public int FacilityId { get; set; }
        public string? UserId { get; set; }
        public string? ReferenceLabId { get; set; }
    }
    public class AddFacilityUserInLabViewModel
    {
        public int? LabId { get; set; }
        public bool IsActive { get; set; }
        public bool IsDefault { get; set; }
        public string? UserId { get; set; }
        public bool IsDeleted { get; set; }
    }
    public enum AccountActivationType
    {
        Username,
        Email
    }
    public class AccountActivationCreadentialsViewModel
    {
        [Required]
        public string? Username { get; set; }
        public string? Password { get; set; }
        [Required]
        public string? PhysicianFullName { get; set; }
        [Required]
        public string? NPI { get; set; }
        [Required]
        public string? StateLicense { get; set; }
    }
    public class FacilityAddressViewModel
    {
        [Required]
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        [Required]
        public string? City { get; set; }
        [Required]
        public string? State { get; set; }
        [Required]
        public string? ZipCode { get; set; }
    }

    public class FacilityFileViewModel : FileViewModel
    {
        public int FacilityId { get; set; }
        public string? FileType { get; set; }
    }

    public class FacilityBulkProcessingOrderLog
    {
        public string? LogId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? FileId { get; set; }
        public string? FileName { get; set; }
        public DateTime CreateTime { get; set; }
    }
}

namespace TrueMed.Domain.Model.Facility.Response
{
    public class FacilityReponseViewModel
    {
        public string? ContactFirstName { get; set; }
        public string? ContactLastName { get; set; }
        public string? FacilityName { get; set; }
        public string? FacilityEmail { get; set; }
        public string? State { get; set; }
        public int? FacilityId { get; set; }
        public string? AddedDate { get; set; }
        public string? ContactPhone { get; set; }
        public string? ClientName { get; set; }
        public string? ClientId { get; set; }
        public string? Status { get; set; }
        public List<UploadFiles>? Files { get; set; }

        public string? SubmittedDate { get; set; }
        public string? SubmittedBy { get; set; }
        public string? Phone { get; set; }
        public string? PrimaryContactName { get; set; }
        public string? PrimaryContactEmail { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? ZipCode { get; set; }
        public bool? IsApproved { get; set; }

    }
}
