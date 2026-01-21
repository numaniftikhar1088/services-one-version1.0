namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request
{
    public class MenuRequest
    {
        public int? MenuId { get; set; }
        public string? MenuName { get; set; }
        public int? DisplayOrder { get; set; }
        public int? ModuleId { get; set; }
        public bool? IsVisible { get; set; }
        public bool? IsActive { get; set; }
        public string? LinkUrl { get; set; }
        public string? MenuIcon { get; set; }
    }
    public class ChangeMenuStatusRequest
    {
        public int MenuId { get; set; }
        public bool? IsActive { get; set; }
    }
    public class ChangeMenuVisibilityRequest
    {
        public int MenuId { get; set; }
        public bool? IsVisible { get; set; }
    }
}
