using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.Domain.Models.Identity
{
    public class UserViewModel
    {
        public string? Id { get; set; }
        //[Required]
        //[UniqueUsername]
        public string? UserName { get; set; }

        [EmailAddress]
        //[Required]
        //[UniqueEmail]
        public string? Email { get; set; }
        [Required]
        public int? UserType { get; set; }
        public string? ReferenceLabName { get; set; }
        [Required]
        public string? Mobile { get; set; }
        public string? Phone { get; set; }
        [Required]
        public string? FirstName { get; set; }
        [Required]
        public string? LastName { get; set; }
        public string? MiddleName { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; } = DateTimeNow.Get;
        public AddressViewModel? Address { get; set; }
        public string? ProfileImageUrl { get; set; }
        public bool? IsActive { get; set; }
        public string? AdminType { get; set; }
    }

    public class AddressViewModel
    {
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        
        public string? ZipCode { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
    }

    public class RegisterMasterUserViewModel : UserViewModel
    {
        public RegisterMasterUserViewModel()
        { }
        [Required]
        public string? Origin { get; set; }
        [Required]
        public int[]? LabIds { get; set; }
    }

    public class LabUserViewModel : UserViewModel
    {
        public LabUserViewModel() { UserType = Enums.UserType.LabUser; }
        [Required]
        public int? RoleId { get; set; }
        [Required]
        public Roles? RoleType { get; set; }
        public int? SubRoleType { get; set; }
        private new UserType? UserType { get; set; }
        public bool? IsReferenceLab { get; set; }
        public string? NPI { get; set; }
        [Required]
        public AccountActivationType? ActivationType { get; set; }
        public string? Password { get; set; }
        public string? StateLicenseNo { get; set; }
        public int[]? FacilitiesIds { get; set; } = new int[] { };
        public string Gender { get; set; }
    }

    public class LabAdminUserViewModel
    {
        public string? Id { get; set; }

        [Required]
        public string? FirstName { get; set; }
        [Required]
        public string? LastName { get; set; }

        [Required]
        public string? AdminEmail { get; set; }
        [Required]
        public int? AdminType { get; set; }
        [Required]
        public int? UserGroupId { get; set; }
    }

    public class UpdateLabAdminUserViewModelMetaDataType
    {
        [Required]
        public string? Id { get; set; }

    }

    [ModelMetadataType(typeof(UpdateLabAdminUserViewModelMetaDataType))]
    public class UpdateLabAdminUserViewModel : LabAdminUserViewModel
    {

    }



    public class UpdateLabUserViewModel : LabUserViewModel
    {
        public UpdateLabUserViewModel()
        {
            base.Id = this.Id;
        }
        [Required]
        public new string? Id { get; set; }
    }




    public class UpdateMasterUserViewModel : UserViewModel
    {
        public UpdateMasterUserViewModel()
        {
            base.Id = this.Id;
            this.UserType = 0;
        }
        [Required]
        public new string? Id { get; set; }

        [Required]
        public string? Origin { get; set; }
        [Required]
        public List<int>? LabIds { get; set; }
    }


    public class SetNewPasswordViewModel : TicketValidationViewModel
    {
        [Required]
        public string? NewPassword { get; set; }
        [Required]
        public SecurityQuestions? Questions { get; set; } = new();
    }

    public class SetNewPasswordUsingUserIdViewModel
    {
        [Required]
        public string? UserId { get; set; }
        [Required]
        public string? NewPassword { get; set; }
    }

    public class SecurityQuestions
    {
        public string? QuestionNo1 { get; set; }
        public string? AnswerNo1 { get; set; }
        public string? QuestionNo2 { get; set; }
        public string? AnswerNo2 { get; set; }
    }

    public class TicketValidationViewModel
    {
        [Required]
        public string? Ticket { get; set; }
        [Required]
        public TicketType TicketType { get; set; }
    }


    public class KeyValuePairViewModel<IdT>
    {
        public string? KeyValue { get; set; }
        public IdT? Id { get; set; }
    }
    public class AddUserFavouriteIconVM
    {
        public List<int>? FavouriteMenuId { get; set; }
        public string? UserId { get; set; }
        public string? Link { get; set; }
        public string? Icon { get; set; }
        public bool? IsChecked { get; set; }
    }
    public class RemoveUserFavouriteIconVM
    {
        public List<int>? FavouriteMenuId { get; set; }
        public string? UserId { get; set; }
    }
    public class BulkUserActivation
    {
        [Required]
        public string[]? UserIds { get; set; }
        [Required]
        public bool? IsActive { get; set; }
    }
}
