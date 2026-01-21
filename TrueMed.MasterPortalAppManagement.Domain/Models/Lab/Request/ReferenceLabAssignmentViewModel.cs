using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Request
{

    public class ReferenceLabAssignmentQueryViewModel
    {
        public string? LabName { get; set; }
        [EnumDataType(typeof(LabType))]
        public LabType? LabType { get; set; }
        [EnumDataType(typeof(LabApprovementStatus))]
        public LabApprovementStatus? LabApprovementStatus { get; set; }
        public int[]? LabIds { get; set; }
        public string? UserByName { get; set; }
    }

    public class ReferenceLabAssignmentViewModel
    {
        public int PrimaryLabId { get; set; }
        public int ReferenceLabId { get; set; }
        //[EnumDataType(typeof(LabType))]
        public int? LabType { get; set; }
        [EnumDataType(typeof(LabApprovementStatus))]
        public LabApprovementStatus? LabApprovementStatus { get; set; } = Dtos.LabApprovementStatus.Pending;
    }
}
