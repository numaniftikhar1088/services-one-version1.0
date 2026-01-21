namespace TrueMed.UserManagement.Domain.Models.Dtos.Response
{
    public class ModuleWithClaimsResponse
    {
        public List<Module>? Modules { get; set; } = new();
        
    }
    public class Module
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? Icon { get; set; }
        public List<Claim>? Claims { get; set; } = new();
    }
    public class Claim
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? LinkUrl { get; set; }
        public int? OrderId { get; set; }
        public string? Icon { get; set; }
        public int? ChildId { get; set; }
        public List<SubClaim>? SubClaims { get; set; } = new();
    }
    public class SubClaim
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? LinkUrl { get; set; }
        public int? OrderId { get; set; }
        public string? Icon { get; set; }
    }
    //public class MenusForLabSideResponse
    //{
    //    public string? Module { get; set; }
    //    public int ModuleId { get; set; }
    //    public string? ModuleIcon { get; set; }
    //    public List<Menu> Menus { get; set; } = new();
    //}
    //public class Menu
    //{
    //    public int? Id { get; set; }
    //    public int ModuleId { get; set; }
    //    public string? Module { get; set; }
    //    public string? ModuleIcon { get; set; }
    //    public string? Name { get; set; }
    //    public string? LinkUrl { get; set; }
    //    public int? OrderId { get; set; }
    //    public string? MenuIcon { get; set; }
    //    public int? ChildId { get; set; }
    //    public List<SubMenu> SubMenus { get; set; } = new();
    //}
    //public class SubMenu
    //{
    //    public int? Id { get; set; }
    //    public string? Name { get; set; }
    //    public string? LinkUrl { get; set; }
    //    public int? OrderId { get; set; }
    //    public string? MenuIcon { get; set; }
    //    public int? ChildId { get; set; }
    //}
}
