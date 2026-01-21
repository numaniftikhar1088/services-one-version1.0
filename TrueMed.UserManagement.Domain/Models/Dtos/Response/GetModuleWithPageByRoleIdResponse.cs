namespace TrueMed.UserManagement.Domain.Models.Dtos.Response
{
    public class GetModuleWithPageResponse
    {
        public string? Module { get; set; }
        public List<Page>? Pages { get; set; } = new();
    }
    public class Page
    {
        public int PageId { get; set; }
        public string? PageName { get; set; }
        public bool? IsSelected { get; set; }
        public bool IsSystemField { get; set; }
    }
}
