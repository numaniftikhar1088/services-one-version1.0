namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request
{
    public class SavePanelSetupRequest
    {
        public int Id { get; set; }

        public string PanelName { get; set; } = null!;

        public int? ReqTypeId { get; set; }

        public string? Tmitcode { get; set; }

        public int? NetworkType { get; set; }

        public bool IsActive { get; set; }


    }
    public class ChangePanelSetupStatusRequest
    {
        public int Id { get; set; }
        public bool? IsActive { get; set; }
    }
}
