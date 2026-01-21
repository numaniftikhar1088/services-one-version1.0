using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Response
{

    public class LabAssignmentManagementViewModel
    {
        public int ReferenceLabId { get; set; }
        public int PrimaryLabId { get; set; }
        public LabType LabType { get; set; }
        public LabApprovementStatus Status { get; set; }
        public DateTime CreateTime { get; set; }
        public string CreateByUserId { get; set; } = String.Empty;
        public DateTime? LastUpdateTime { get; set; }
        public string? LastUpdateByUserId { get; set; }
    }


    public class LabAssignmentResponseViewModel
    {
        public int PrimaryLabId { get;set;}
        public int ReferenceLabId { get;set;}
        public string ReferenceLabName { get; set; } = string.Empty;
        public string PrimaryLabName { get; set; } = string.Empty;
        public LabType AssignmentLabType { get; set; }
        public LabApprovementStatus Status { get;set;}
        public string StatusName { get { return Enum.GetName(typeof(LabApprovementStatus), Status); } }
        public string AssignmentLabTypeName { get { return Enum.GetName(typeof(LabType), AssignmentLabType); } }

        public DateTime CreateDate { get; set; }
        public string CreateBy { get; set; } = string.Empty;
        public string CreateByName { get; set; }
        public string? ReferenceLabCLIA { get; set; }
    }
}
