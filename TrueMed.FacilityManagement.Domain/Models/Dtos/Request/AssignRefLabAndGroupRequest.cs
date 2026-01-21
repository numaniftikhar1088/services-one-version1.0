namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Request
{
    public class AddAssignRefLabAndGroupRequest
    {
        public int FacilityId { get; set; }
        public int RefLabId { get; set; }

        public int LabType { get; set; }

        public int ReqTypeId { get; set; }

        public int? GroupId { get; set; }

        public int? InsuranceId { get; set; }

        public int? InsuranceOptionId { get; set; }

        public string? Gender { get; set; }
    }
    public class EditAssignRefLabAndGroupRequest : AddAssignRefLabAndGroupRequest
    {
        public int Id { get; set; }
    }
    public class StatusChangedAssignRefLabAndGroupRequest
    {
        public int Id { get; set; }
        public bool Status { get; set; }
    }
}
