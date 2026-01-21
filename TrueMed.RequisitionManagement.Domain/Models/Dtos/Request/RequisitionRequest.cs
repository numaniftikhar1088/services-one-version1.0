using Newtonsoft.Json;
using System.ComponentModel;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class RequisitionRequest
    { 
        public class DynamicRequisitionSave
        {
            public int RequisitionFormId { get; set; }
            [DefaultValue(false)]
            public bool IsPatientDemoChanged { get; set; }
            public List<RequisitionType>? Requisition { get; set; }
           
        }
        public class RequisitionType
        {
            public int ReqTypeId { get; set; }
            public string? ReqTypeName { get; set; }
            public List<SectionWithControl>? SectionWithControls { get; set; }
        }
        public class SectionWithControl
        {
            public int SectionId { get; set; }
            public string? SectionName { get; set; }
            public List<ControlWithCustom> Controls { get; set; }

        }
        public class ControlWithCustom
        {
            public List<ControlInfo>? SystemFields { get; set; }
            public List<CustomControl>? CustomFields { get; set; }
        }
        public class ControlInfo
        {
            public int ControlId { get; set; }
            public string? ControlName { get; set; }
            public object ControlValue { get; set; }
        }
        public class CustomControl
        {
            public int ControlId { get; set; }
            public string? ControlName { get; set; }
            public object ControlValue { get; set; }
        }
        public class AddNewProvider
        {
            public string? NPI { get; set; }
            public string? FirstName { get; set; }
            public string? LastName { get; set; }
            public string? Gender { get; set; }
            public string? Email { get; set; }
        }
    }
}
