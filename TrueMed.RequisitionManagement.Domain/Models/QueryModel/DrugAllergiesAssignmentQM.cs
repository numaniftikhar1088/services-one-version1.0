namespace TrueMed.RequisitionManagement.Domain.Models.QueryModel
{
    public class DrugAllergiesAssignmentQM
    {
        public int Id { get; set; }
        public string? Code { get; set; }
        public string? DrugDescription { get; set; }
        public int? RefLabId { get; set; }
        public string? ReferenceLab { get; set; }
        public int? ReqTypeId { get; set; }
        public string? Requisition { get; set; }
        public int? FacilityId { get; set; }
        public string? Facility { get; set; }
        public int? PanelId { get; set; }
        public string? Panel { get; set; }
        public bool? Status { get; set; }
    }
}
