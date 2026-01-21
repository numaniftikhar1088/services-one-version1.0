using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblUser
    {
        public TblUser()
        {
            TblExternalProviders = new HashSet<TblExternalProvider>();
            TblLabUsers = new HashSet<TblLabUser>();
            TblRefLabAssignmentCreatedByNavigations = new HashSet<TblRefLabAssignment>();
            TblRefLabAssignmentUpdateByNavigations = new HashSet<TblRefLabAssignment>();
            TblUserPermissions = new HashSet<TblUserPermission>();
            TblUserRoles = new HashSet<TblUserRole>();
            TblUserfavouriteMenus = new HashSet<TblUserfavouriteMenu>();
        }

        public string Id { get; set; } = null!;
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

        public virtual TblUserAdditionalInfo IdNavigation { get; set; } = null!;
        public virtual ICollection<TblExternalProvider> TblExternalProviders { get; set; }
        public virtual ICollection<TblLabUser> TblLabUsers { get; set; }
        public virtual ICollection<TblRefLabAssignment> TblRefLabAssignmentCreatedByNavigations { get; set; }
        public virtual ICollection<TblRefLabAssignment> TblRefLabAssignmentUpdateByNavigations { get; set; }
        public virtual ICollection<TblUserPermission> TblUserPermissions { get; set; }
        public virtual ICollection<TblUserRole> TblUserRoles { get; set; }
        public virtual ICollection<TblUserfavouriteMenu> TblUserfavouriteMenus { get; set; }
    }
