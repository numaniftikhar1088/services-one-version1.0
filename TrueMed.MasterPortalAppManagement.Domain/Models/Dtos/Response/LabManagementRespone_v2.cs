using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response
{
    public class LabManagementRespone_v2
    {
        public class GetReferenceLabAssignmentResponse
        {
            public int LabId { get; set; }
            public string? ReferenceLab { get; set; }
            public string? PrimaryLab { get; set; }
            public string? CLIA { get; set; }
            public string? Status { get; set; }
            public string? CreatedBy { get; set; }
            public string? CreatedDate { get; set; }
        }
    }
}
