namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class DrugAllergiesAssignmentRequest
    {
        public class SaveRequest
        {
            public int Id { get; set; }
            public string? Code { get; set; }
            public string? DrugName { get; set; }
            public int? RefLabId { get; set; }
            public int? ReqTypeId { get; set; }
            public int? FacilityId { get; set; }
            public int? PanelId { get; set; }
            public bool? Status { get; set; }
        }
        public class StatusChangedRequest
        {
            public int Id { get; set; }
            public bool? Status { get; set; }
        }
    }
}
