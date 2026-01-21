using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel
{
    public class ReferenceLabQueryModel
    {
        public int ReferenceLabId { get; set; }
        public string? LabName { get; set; }
        public string? LabDisplayName { get; set; }
        public string? PortalLogo { get; set; }
        public string? CLIA { get; set; }
        public string? Enter3DigitsProgram { get; set; }
        public string? Enter3DigitsLabCode { get; set; }
        public string? LabType { get; set; }
        public bool? EnableReferenceId { get; set; }
        public bool? Status { get; set; }
        public Lab_Address? LabAddress { get; set; }
        public Lab_DirectorInfo? LabDirectorInfo { get; set; }
    }
}
