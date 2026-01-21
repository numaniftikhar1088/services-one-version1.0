using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Laboratory;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos
{
    public class LabViewModel : LabBaseViewModel
    {
        [Required]
        public new string? LabName { get; set; }
        [Required]
        public new string? LabDisplayName { get; set; }
        [Required]
        public new string? CLIA { get; set; }
        [Required]
        public new string? Email { get; set; }
        [Required]
        public new string? Phone { get; set; }
        [Required]
        public new bool? IsReferenceLab { get; set; }

        public string? Mobile { get; set; }
        public string? DbName { get; set; }
        public int? CopyFromLab { get; set; }
        public bool isDeleteFacilities { get; set; }
        public bool isDeleteAssignedReferenceLabs { get; set; }
        public bool isDeletePatients { get; set; }
        public bool isDeleteUsers { get; set; }
        public bool isDeleteAssignedInsurances { get; set; }
        public bool isDeleteICD10Assignment { get; set; }
        public bool isDeleteInsuranceAssignment { get; set; }

        [Required]
        public new bool? IsActive { get; set; }
        [Required]
        public new AddressViewModel? Address { get; set; }
        public new List<int> ReferenceLabs { get; set; } = new List<int>();
        [Required]
        public new LabDirectorDetailsViewModel? LabDirector { get; set; }
    }

    public class UpdateLabViewModel : LabViewModel
    {
        [Required]
        public new int? LabId { get; set; }
    }
}
