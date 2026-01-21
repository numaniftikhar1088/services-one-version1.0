namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class RequisitionResponse
    {
        public class SectionPlusControlsWithValue
        {
            public List<SectionWithControls>? SectionWithControlInfo { get; set; } = new();
        }
        public class SectionWithControls
        {
            public int SectionId { get; set; }
            public string? SectionName { get; set; }
            public List<ControlWithValue>? Controls { get; set; } = new();
        }
        public class ControlWithValue
        {
            public int ControlId { get; set; }
            public string? ControlName { get; set; }
            public dynamic? Value { get; set; }
        }
    }
}
