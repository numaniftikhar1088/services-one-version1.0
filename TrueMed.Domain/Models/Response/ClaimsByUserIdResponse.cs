
namespace TrueMed.Domain.Models.Response
{
    public class LoggedInUserInformation
    {
        public LoggedInUserInformation()
        {
            Facilities = new List<FacilityInformation>();
            Claims = new List<ModuleWithClaims>();
        }
        public string AdminType { get; set; }
        public string UserType { get; set; }
        public List<ModuleWithClaims> Claims { get; set; }
        public List<FacilityInformation> Facilities { get; set; }
        
    }
    public class FacilityInformation
    {
        public FacilityInformation()
        {
            FacilityClaims = new List<ModuleWithClaims>();
        }
        public int? FacilityId { get; set; }
        public string? FacilityName { get; set; }
        public bool DirectGoToFacility { get; set; }
        public List<ModuleWithClaims> FacilityClaims { get; set; }
    }
    public class ClaimsByUserIdResponse
    {
        public ClaimsByUserIdResponse()
        {
            Modules = new List<ModuleWithClaims>();
        }
        public List<ModuleWithClaims> Modules { get; set; }
    }
    public class ModuleWithClaims
    {
        public ModuleWithClaims()
        {
            Claims = new List<Menu>();
        }
        public int ModuleId { get; set; }
        public string? Module { get; set; }
        public string? ModuleIcon { get; set; }
        public List<Menu> Claims { get; set; }
    }
    public class PageClaims
    {
        public int PageId { get; set; }
        public int ClaimId { get; set; }
    }
    public class ModulePage
    {
        public int ModuleId { get; set; }
        public int PageId { get; set; }
    }
    public class Menu
    {
        public Menu()
        {
            SubClaims = new List<SubMenu>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public string LinkUrl { get; set; }
        public int? OrderBy { get; set; }
        public string ICon { get; set; }
        public int? ChildId { get; set; }
        public List<SubMenu> SubClaims { get; set; }

    }
    public class SubMenu
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LinkUrl { get; set; }
        public int? OrderBy { get; set; }
        public string ICon { get; set; }
    }

    public class LoggedInRoleWithInformation
    {
        public string Role { get; set; }

        public LoggedInUserInformation LoggedInUserInformation { get; set; }

    }

}
