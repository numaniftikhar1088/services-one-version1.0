using Microsoft.AspNetCore.Http;

namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Request
{
    public class FacilityFileUploadRequest
    {
        public List<IFormFile> Files { get; set; }
        public int? FacilityId { get; set; }
    }
}
