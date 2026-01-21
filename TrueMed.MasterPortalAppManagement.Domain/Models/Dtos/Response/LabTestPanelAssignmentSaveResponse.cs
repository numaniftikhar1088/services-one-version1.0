namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response
{
    public class LabTestPanelAssignmentSaveResponse
    {
        public int? Id { get; set; }
        public int? PanelId { get; set; }
        public string? PanelName { get; set; }
        public string? PanelDisplayName { get; set; }
        public string? PanelTMITCode { get; set; }
        public string? PanelNetworkType { get; set; }
        public int? TestId { get; set; }
        public string? TestName { get; set; }
        public string? TestDisplayName { get; set; }
        public string? TestTMITCode { get; set; }
        public string? TestNetworkType { get; set; }
        public int? ReqTypeId { get; set; }
        public string? RequisitionType { get; set; }
        public string? RequisitionTypeName { get; set; }
        public string? RequisitionColor { get; set; }
        public int? LabId { get; set; }
        public string? LaboratoryName { get; set; }
        public string? LaboratoryDiplayName { get; set; }
    }
}
