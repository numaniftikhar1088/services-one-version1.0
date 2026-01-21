namespace TrueMed.ReportingServer.Domain.Dtos.Request
{
    public class IDLISReportRequest
    {
        public int ReqId { get; set; }
        public string TemplateId { get; set; }
        public int ReqType { get; set; }
        public int FacilityId { get; set; }
        public bool IsPreview { get; set; }

    }
}
