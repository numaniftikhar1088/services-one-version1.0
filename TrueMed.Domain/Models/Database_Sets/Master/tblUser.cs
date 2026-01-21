using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblUser
{
    public string Id { get; set; } = null!;

    public int? UserAccountType { get; set; }

    public string? Username { get; set; }

    public string? PasswordHash { get; set; }

    public string? Email { get; set; }

    public string? SecurityQuestion1 { get; set; }

    public string? SecurityQuestion2 { get; set; }

    public string? SecurityAnswer1 { get; set; }

    public string? SecurityAnswer2 { get; set; }

    public bool? IsActive { get; set; }

    public DateTime CreateDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? FirstName { get; set; }

    public string? MiddleName { get; set; }

    public string? LastName { get; set; }

    public string? Gender { get; set; }

    public bool IsDeleted { get; set; }

    public string? ProfileImage { get; set; }

    public string? MobileNumber { get; set; }

    public string? PhoneNumber { get; set; }

    public int UserType { get; set; }

    public string? Address1 { get; set; }

    public string? Address2 { get; set; }

    public string? ZipCode { get; set; }

    public string? State { get; set; }

    public string? City { get; set; }

    public bool IsDirector { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public string? UserTitle { get; set; }
    public string? AdminType { get; set; }

    //public virtual TblUserAdditionalInfo IdNavigation { get; set; } = null!;

    //public virtual ICollection<TblExternalProvider> TblExternalProviders { get; } = new List<TblExternalProvider>();

    public virtual ICollection<TblLabUser> TblLabUsers { get; } = new List<TblLabUser>();
    public virtual ICollection<TblUserPermission> TblUserPermissions { get; } = new List<TblUserPermission>();

    //public virtual ICollection<TblUserRole> TblUserRoles { get; } = new List<TblUserRole>();

    //public virtual ICollection<TblUserfavouriteMenu> TblUserfavouriteMenus { get; } = new List<TblUserfavouriteMenu>();
}
