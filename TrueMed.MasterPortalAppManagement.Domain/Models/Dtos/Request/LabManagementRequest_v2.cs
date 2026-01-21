namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request
{
    public class LabManagementRequest_v2
    {
        public class StatusChangedRequest
        {
            public int LabId { get; set; }
            public int Status { get; set; }
        }
    }
}
