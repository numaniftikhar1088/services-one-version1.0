using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Identity;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Response
{
    public class LabDatatableResponseViewModel
    {
        public int LabId { get; set; }
        public string? Logo { get; set; }
        public string? LabName { get; set; }
        public string? LabDisplayName { get; set; }
        public string? CLIA { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public AddressViewModel? Address { get; set; }
        public string? LabDirectorName { get; set; }
        public string? DirectorPhone { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsReferenceLab { get; set; }
        public DateTime? CreateDate { get; set; }
    }

    public class ReferenceLabDatatableResponseViewModel : LabDatatableResponseViewModel
    {
        public LabApprovementStatus? ApprovementStatus { get; set; }
        public string? ApprovementStatusName
        {
            get
            {
                if (ApprovementStatus != null)
                    return Enum.GetName((LabApprovementStatus)ApprovementStatus);
                else
                    return "Pending";
            }
        }
    }
}
