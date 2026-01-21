namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Response
{
    public class FacilityOptionsResponse
    {
        public int Id { get; set; }

        public string? OptionName { get; set; }
        public bool? IsEnabled { get; set; }
        public List<FacilityInfo> Facilities { get; set; }
    }
    public class FacilityInfo
    {
        public int Id { get; set; }
        public string? FacilityName { get; set; }
    }
}
