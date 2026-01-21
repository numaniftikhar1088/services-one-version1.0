using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.FacilityManagement.Domain.Models.Facility.DTOs;

namespace TrueMed.FacilityManagement.Domain.Models.Facility.Request
{
    public class FacilityReferenceLabAssignmentQueryViewModel
    {
        public string? Name { get; set; }
        [EnumDataType(typeof(LabType))]
        public LabType? LabType { get; set; }
        [EnumDataType(typeof(LabApprovementStatus))]
        public LabApprovementStatus? LabApprovementStatus { get; set; }
        public int[]? FacilityIds { get; set; }
    }

    public class FacilityReferenceLabAssignmentViewModel
    {
        [Required]
        public int? FacilityId { get; set; }
        [Required]
        public int? ReferenceLabId { get; set; }
        [Required]
        public int? ReqTypeId { get; set; }
        [Required]
        [EnumDataType(typeof(LabType))]
        public LabType LabType { get; set; }
        public bool? LabApprovementStatus { get; set; }
    }
}
