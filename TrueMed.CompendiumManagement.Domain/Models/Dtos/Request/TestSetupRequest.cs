namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Request
{
    public class SaveTestSetupRequest
    {
        public int TestId { get; set; }
        public string TestName { get; set; } = null!;
        public string TestDisplayName { get; set; }
        public int? TestTypeId { get; set; }
        public string? Tmitcode { get; set; }
        public bool? TestStatus { get; set; }
        public int? ReqTypeId { get; set; }
    }
    public class ChangeTestSetupStatusRequest
    {
        public int TestId { get; set; }
        public bool? TestStatus { get; set; }
    }
}
