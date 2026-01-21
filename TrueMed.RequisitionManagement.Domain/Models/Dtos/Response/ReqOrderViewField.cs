namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class ReqOrderViewField
    {
        public int ControlId { get; set; }
        public string SystemFieldName { get; set; }
        public string FieldName { get; set; }
        public dynamic FieldValue { get; set; }
        public string DisplayType { get; set; }
        public int SortOrder { get; set; }

    }
}