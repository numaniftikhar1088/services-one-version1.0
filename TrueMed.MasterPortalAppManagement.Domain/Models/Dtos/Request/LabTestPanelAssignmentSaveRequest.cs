namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request
{
    public class LabTestPanelAssignmentSaveRequest
    {
        public int Id { get; set; }

        public int? PanelId { get; set; }

        public int? TestId { get; set; }

        public int? LabId { get; set; }

        public int? ReqTypeId { get; set; }
    }
}
