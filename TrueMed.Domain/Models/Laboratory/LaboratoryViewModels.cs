using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.Domain.Model.Laboratory
{
    public class VerifyLaboratoryViewModel
    {
        [Required]
        public string? LabName { get; set; }
    }

    public class LaboratoryResponseViewModel : VerifyLaboratoryViewModel
    {
        public string? LabUrl { get; set; }
    }


    public class LaboratoryBriefInfoViewModel
    {
        public int? Id { get; set; }
        public string? LabKey { get; set; }
        public string? LabName { get; set; }
        public string? LabUrl { get; set; }
        public string? Logo { get; set; }
        public bool? IsReferenceLab { get; set; }
        public bool IsDefault { get;  set; }
    }

    public class LabBaseViewModel : LaboratoryBriefInfoViewModel
    {
        public string? LabDisplayName { get; set; }
        public string? CLIA { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public DateTime CreateDate { get; set; }
        public string? Fax { get; set; }
        public bool? IsActive { get; set; }
        public AddressViewModel? Address { get; set; }
        public List<int> ReferenceLabs { get; set; } = new List<int>();
        public LabDirectorDetailsViewModel? LabDirector { get; set; }
    }
    public class LabUserViewModel
    {
        public string? UserId { get; set; }
        public int? LabId { get; set; }
        public bool? IsDefault { get; set; }
        public bool? IsActive { get; set; }
    }

    public class LabDirectorDetailsViewModel
    {
        [Required]
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        [Required]
        public string? LastName { get; set; }
        [Required]
        [EmailAddress]
        public string? EmailAddress { get; set; }
        [Required]
        public string? Mobile { get; set; }
        public string? Phone { get; set; }
        [Required]
        public AddressViewModel? Address { get; set; } = new();
    }
}
