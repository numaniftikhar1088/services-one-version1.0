namespace TrueMed.Business.Middlewares.Models
{
    public class PermissionModel
    {
        public string? UserId { get; set; }
        public List<ApplicationLink>? Links { get; set; } = new List<ApplicationLink>();
    }
    public class ApplicationLink
    {
        public string? PermissionLink { get; set; }
        public bool IsPublic { get; set; }

    }

}
