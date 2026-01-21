namespace TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel
{
    public class LabManagementQueryModel
    {
        public class GetReferenceLabAssignmentQM
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
