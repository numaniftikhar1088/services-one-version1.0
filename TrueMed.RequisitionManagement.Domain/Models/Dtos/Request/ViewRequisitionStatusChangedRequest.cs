using Microsoft.AspNetCore.Http;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class ViewRequisitionStatusChangedRequest
    {
        public int[]? RequisitionIds { get; set; }
        public int? StatusId { get; set; }
        public string? ActionReasons { get; set; }
    }

    public class updateNextStepStatus
    {
        public int RequisitionId { get; set; }
        //public string RequisitionOrderId { get; set; }
        public string NextStep { get; set; }
        public int RequisitionOrderId { get; set; }
        //public string RecordId { get; set; }
        public IFormFile? file { get; set; }
        public string? RequisitionType { get; set; }

    }
}
