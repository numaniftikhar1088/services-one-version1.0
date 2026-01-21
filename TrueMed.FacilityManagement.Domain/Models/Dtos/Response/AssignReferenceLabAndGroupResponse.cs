namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Response
{
    public class AssignReferenceLabAndGroupResponse
    {
        public string? ProfileName { get; set; }
        public string? ReferenceLabName { get; set; }
        public string? RequisitionTypeName { get; set; }
        public string? GroupNames { get; set; }
        public bool? IsDefault { get; set; }
    }
    public class AssignReferenceLabAndGroupByIdResponse : AssignReferenceLabAndGroupResponse
    { }
}
