using TrueMed.Domain.Enums;
using TrueMed.Domain.Model.Identity;
using TrueMed.Sevices.MasterEntities;
namespace TrueMed.Business.Helpers
{
    public static class ApplicationUserExtention
    {
        public static ApplicationUser InitializeUser(this TblUser user)
        {
            ApplicationUser applicationUser = new ApplicationUser();
            applicationUser.Username = user.Username;
            applicationUser.Email = user.Email;
            applicationUser.FirstName = user.FirstName;
            applicationUser.LastName = user.LastName;
            applicationUser.MiddleName = user.MiddleName;
            applicationUser.DateOfBirth = user.DateOfBirth;
            applicationUser.Id = user.Id;
            applicationUser.Phone = user.PhoneNumber;
            applicationUser.Mobile = user.MobileNumber;
            applicationUser.UserType = (UserType)user.UserType;
            applicationUser.ProfileImageUrl = user.ProfileImage;
            return applicationUser;
        }
    }
}
