using Newtonsoft.Json;
using System.ComponentModel;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class V2_RequisitionRequest
    { 
        public class V2_DynamicRequisitionSave
        {
            public List<SectionWithFields> SectionWithFields { get; set; }
        }
        public class SectionWithFields
        {
            public int SectionId { get; set; }
            public List<Field>? Fields { get; set; }
        }
        public class Field
        {
            public int ControlId { get; set; }
            public string? SystemFieldName { get; set; }
            public int UITypeId { get; set; }
            public int SectionType { get; set; }
            public dynamic Value { get; set; }
        }
    }
}
