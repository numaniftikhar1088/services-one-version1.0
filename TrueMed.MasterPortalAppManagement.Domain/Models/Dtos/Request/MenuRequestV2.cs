namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request
{
    public class MenuRequestV2
    {
        public class SaveMenuRequest
        {
            public int MenuId { get; set; }
            public string? MenuName { get; set;}
            public int ModuleId { get; set; }
            public string? MenuLink { get; set; }
            public bool? IsVisible { get; set; }
            public int DisplayOrder { get; set; }
        }
    }
}
