namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class ReqOrderViewSections
    {
        public int SectionId { get; set; }
        public string SectionDisplayName { get; set; }
        public string SectionDisplayType { get; set; }
        public int SortOrder { get; set; }
        public List<RequisitionOrderViewResponse> Requistions { get; set; }
        public List<ReqOrderViewField> Fields { get; set; }


    }
}