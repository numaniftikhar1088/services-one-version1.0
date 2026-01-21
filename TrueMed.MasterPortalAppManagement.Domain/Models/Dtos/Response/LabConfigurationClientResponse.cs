using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Enums;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response
{
    public class SectionWithControlsAndDependenciesClient
    {
     

        public int PageId { get; set; }
        public int SectionId { get; set; }
        public string? SectionName { get; set; }
        public bool? IsSelected { get; set; }
        public int? SortOrder { get; set; }
        public string DisplayType { get; set; }
        public string CssStyle { get; set; }
        public string CustomScript { get; set; } 
        public List<ControlWithDependenciesClient> Fields { get; set; } = new List<ControlWithDependenciesClient>();
        public List<DependencyControlsClient> DependencyControls { get; set; } = new List<DependencyControlsClient>();
    }
    public class ControlWithDependenciesClient
    {
        public int ControlId { get; set; }
        public int ControlDataID { get; set; }
        public string? SystemFieldName { get; set; }
        public string? DisplayFieldName { get; set; }
        public int UITypeId { get; set; }
        public string? UIType { get; set; }
        public bool? Required { get; set; }
        public bool? IsNew { get; set; }
        public SectionType? SectionType { get; set; }
        public bool? Visible { get; set; }
        public string? DefaultValue { get; set; }
        public List<OptionClient> Options { get; set; }
        public int SortOrder { get; set; }
        public string? CssStyle { get; set; }
        public string DispayRule { get; set; } = "";
        public string EnableRule { get; set; } = "";
        public string? DisplayType { get; set; }
        public List<DependencyControlsClient> DependencyControls { get; set; }
        public List<ControlWithDependenciesClient> RepeatFields { get; set; } = new List<ControlWithDependenciesClient>();
        public List<DependencyControlsClient> RepeatDependencyControls { get; set; } = new List<DependencyControlsClient>();
        public List<ControlWithDependenciesClient> RepeatFieldsState { get; set; } = new List<ControlWithDependenciesClient>();
        public List<DependencyControlsClient> RepeatDependencyControlsState { get; set; } = new List<DependencyControlsClient>();


    }
    public class DependencyControlsClient
    {
        public string? Name { get; set; }
        public int optionID { get; set; }
        public int OptionDataID { get; set; }
        public string Value { get; set; }
        public string Label { get; set; }
        public List<ControlWithDependenciesClient> DependecyFields { get; set; }
        public string DependencyAction { get; set; }
    }

    public class ControlsAndDependentControlsClient
    {
        public ControlWithDependenciesClient Fields { get; set; } = new ControlWithDependenciesClient();
        public List<DependencyControlsClient> DependencyControls { get; set; }
    }

    public class OptionClient
    {
        public string? Name { get; set; }
        public int id { get; set; }
        public string Value { get; set; }
        public int OptionDataID { get; set; }
        public string Label { get; set; }
        public bool isSelectedDefault { get; set; }
        public bool isVisable { get; set; }
        public List<ControlWithDependenciesClient> DependencyControls { get; set; }

    }



}
