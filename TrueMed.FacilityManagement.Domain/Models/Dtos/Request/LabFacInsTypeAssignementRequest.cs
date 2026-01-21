using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Request
{
    public class SaveLabFacInsTypeAssignementRequest
    {
        public int LfiAssignmentId { get; set; }
        [Required]
        public int? RefLabId { get; set; }
        public string? LabType { get; set; }
        [Required]
        public int? FacilityId { get; set; }
        [Required]
        public int? ReqTypeId { get; set; }
        [Required]
        public int? GroupId { get; set; }
        [Required]
        public int? InsuranceId { get; set; }
        public string? Gender { get; set; }
        public bool? Status { get; set; }
    }
    public class ChangeLabFacInsTypeAssignementStatusRequest
    {
        [Required]
        public int LfiAssignmentId { get; set; }
        [Required]
        public bool? Status { get; set; }
    }
}
