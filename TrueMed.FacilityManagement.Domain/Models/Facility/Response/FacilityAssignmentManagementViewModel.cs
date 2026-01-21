using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.FacilityManagement.Domain.Models.Facility.DTOs;

namespace TrueMed.FacilityManagement.Domain.Models.Facility.Response
{
    public class FacilityAssignmentManagementViewModel
    {
        public int ReferenceLabId { get; set; }
        public int FacilityId { get; set; }
        public int ReqTypeId { get; set; }
        public LabType LabType { get; set; }
        public LabApprovementStatus Status { get; set; }
        public DateTime CreateTime { get; set; }
        public string CreateByUserId { get; set; } = string.Empty;
        public DateTime? LastUpdateTime { get; set; }
        public string? LastUpdateByUserId { get; set; }
    }


    public class FacilityAssignmentResponseViewModel
    {
        public int FacilityId { get; set; }
        public int ReqTypeId { get; set; }
        public int ReferenceLabId { get; set; }
        public string ReferenceLabName { get; set; } = string.Empty;
        public LabType LabType { get; set; }
        public bool LabApprovementStatus { get; set; }
        public string LabApprovementStatusName { get { return Enum.GetName(typeof(LabApprovementStatus), LabApprovementStatus); } }
        public string LabTypeName { get { return Enum.GetName(typeof(LabType), LabType); } }
    }
}
