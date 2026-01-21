namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Request
{
    public class FileDataRequest
    {
        public string? FileName { get; set; }
        public byte[]? Contents { get; set; }
    }
}
