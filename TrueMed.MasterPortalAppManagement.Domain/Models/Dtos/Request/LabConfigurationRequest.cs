using StackExchange.Redis;
using TrueMed.Domain.Enums;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request
{
    public class SaveLabConfigurationRequest
    {
        public int? PageId { get; set; }
        public int? SectionId { get; set; }
        public string SectionName { get; set; }
        public int? IsReqSection { get; set; }
        public int? LabId { get; set; }
        public bool? IsSelected { get; set; }
        public List<Control> Controls { get; set; } = new List<Control>();
    }
    public class SaveLabConfigurationRequestV2
    {
        public int? PageId { get; set; }

        public int? SectionId { get; set; }
        public string SectionName { get; set; }
        public string ReqName { get; set; }
        public int ReqId { get; set; }
        public string ReqDisplayName { get; set; }
        public int? IsReqSection { get; set; }
        public int? LabId { get; set; }
        public bool? IsSelected { get; set; }
        public int? SortOrder { get; set; }
        public string? CssStyle { get; set; }

        public string? DisplayType { get; set; }

        public string? CustomScript { get; set; }
        public List<SaveControlWithDependenciesV2> Controls { get; set; } = new List<SaveControlWithDependenciesV2>();
    }
    public class SaveControlWithDependenciesV2
    {
        public int ControlId { get; set; }
        public string? SystemFieldName { get; set; }
        public string? DisplayFieldName { get; set; }
        public int UITypeId { get; set; }
        public string? UIType { get; set; }
        public bool? Required { get; set; }
        public string? FormatMask { get; set; }
        public string? ColumnValidation { get; set; }
        public bool? IsNew { get; set; }
        public SectionType? SectionType { get; set; }
        public bool? Visible { get; set; }
        public string? DefaultValue { get; set; }
        public List<SaveOptionV2> Options { get; set; }
        public int SortOrder { get; set; }
        public int? OrderViewSortOrder { get; set; }
        public string? OrderViewDisplayType { get; set; }
        public string? CssStyle { get; set; }
        public string? DisplayType { get; set; }
        public List<int>? PortalTypeIds { get; set; }
       
    }
    public class SaveOptionV2
    {
        public string? Name { get; set; }
        public int id { get; set; }
        public string Value { get; set; }
        public string Label { get; set; }
        public bool isSelectedDefault { get; set; }
        public bool isVisable { get; set; }
       
        //public List<int> DependenceyControls { get; set; }
        public List<DependenceyControlsWithAction>? DependenceyControls { get; set; } = new List<DependenceyControlsWithAction>();

    }
    public class DependenceyControlsWithAction {

        public int DependenceyControlID { get; set; }
        public string? DependenceyAction { get; set; }
    }

    public class SaveRequisitionTypeViewModel
    {
        public string ReqName { get; set; }
        public int ReqId { get; set; }
        public string ReqDisplayName { get; set; }
        public int? IsReqSection { get; set; }
        public int? LabId { get; set; }
        public bool? IsSelected { get; set; }
    }


}
