using Microsoft.Graph;
using System.Security.Principal;
using TrueMed.Domain.Enums;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response
{
    public class SectionWithControls
    {
        public int PageId { get; set; }
        public int SectionId { get; set; }
        public string? SectionName { get; set; }
        public bool? IsSelected { get; set; }
        //public int SortOrder { get; set; }      
        public List<Control> Fields { get; set; } = new List<Control>();
    }
    public class Control
    {
        public int ControlId { get; set; }
        public string? SystemFieldName { get; set; }
        public string? DisplayFieldName { get; set; }
        public int UITypeId { get; set; }
        public string? UIType { get; set; }
        public bool? Required { get; set; }
        public bool? IsNew { get; set; }
        public SectionType? SectionType { get; set; }
        public bool? Visible { get; set; }
        public string? DefaultValue { get; set; }
        public string? Options { get; set; }
        public int SortOrder { get; set; }
        public string? CssStyle { get; set; }       
        public string? DisplayType { get; set; }
    }
    public class ControlLookup
    {
        public int UITypeId { get; set; }
        public string? UITypeName { get; set; }
    }
    
        
    public class SectionWithControlsAndDependencies
    {
        public int PageId { get; set; }
        public int SectionId { get; set; }
        public string? SectionName { get; set; }
        public bool? IsSelected { get; set; }
        public int? SortOrder { get; set; }
        public string? CssStyle { get; set; }

        public string? DisplayType { get; set; }

        public string? CustomScript { get; set; }

        public List<ControlWithDependencies> Fields { get; set; } = new List<ControlWithDependencies>();
        public List<DependenceyControls> DependenceyControls { get; set; }
    }
   

    public class ControlWithDependencies
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
        public List<Option> Options { get; set; }
        public int SortOrder { get; set; }
        public int? OrderViewSortOrder { get; set; }
        public string? OrderViewDisplayType { get; set; }
        public string? CssStyle { get; set; }
        public string? DisplayType { get; set; }
        public List<int>? PortalTypeIds { get; set; }
       public List<DependenceyControls> DependenceyControls { get;set; }
    }
    public class Option
    {
        public string? Name { get; set; }
        public int id { get; set; }
        public string Value { get; set; }
        public string Label  { get; set; }
        public bool isSelectedDefault { get; set; }
        public bool isVisable { get; set; }
        public List<ControlWithDependencies> DependenceyControls { get; set; }
        public string DependencyAction { get; set; }
    }

    public class ControlsAndDependentControls
    {
        public ControlWithDependencies Fields { get; set; } = new ControlWithDependencies();
        public List<DependenceyControls> DependenceyControls { get; set; }
    }
   
    public class DependenceyControls
    {
        public string? Name { get; set; }
        public int optionID { get; set; }
        public string Value { get; set; }
        public string Label { get; set; }
        public string DependencyAction { get; set; }
        public List<ControlWithDependencies> DependecyFields { get; set; }
    }











}
