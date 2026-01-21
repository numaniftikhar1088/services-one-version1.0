using TrueMed.Business.Models.Identity.Request;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Identity.Response;
using TrueMed.Domain.Models.Response;
using static TrueMed.Domain.Repositories.Identity.Implementation.UserManagement;

namespace TrueMed.Domain.Repositories.Identity.Interface
{
    public partial interface IUserManagement : IDisposable, IDbContextInitialize
    {
        bool IsUserEmailValid(KeyValuePairViewModel<string?> uniqueKeyValidation);
        bool IsUserNameValid(KeyValuePairViewModel<string?> uniqueKeyValidation);
        bool IsUserExistsById(string id);
        ApplicationUser GetUserByEmail(string email);
        ApplicationUser GetUserById(string userId);
        ApplicationUserBase GetUserBriefInfoById(string userId);
        UserAdditionalInfo GetUserAdditionalInfoById(string userId);
        /// <summary>
        /// validation based on email/username
        /// </summary>
        /// <param name="name">email/username</param>
        /// <param name="password"></param>
        /// <returns></returns>
        Task<ApplicationUser?> GetUserByNameAndPasswordAsync(string name, string password);
        ApplicationUser GetUserByUsername(string username);
        IdentityResult RegisterUser(ApplicationUser user, string? password);
        IdentityResult UpdateUser(ApplicationUser user, string? password = null);
        bool SignIn(string username, string[] roles, ICollection<string> claims);
        IdentityResult UpdateUserAdditionalInfo(UserAdditionalInfo user);
        bool Validate(string username, string password);
        ApplicationUser ValidateRequestTicket(string ticket, TicketType ticketType);
        IdentityResult SetNewPassword(ApplicationUser user, string password, SecurityQuestions? securityQuestions = null);
        Task<bool> SetNewPasswordByUserIdAsync(string userId, string newPassword);
        bool RemoveRequestTicket(string ticket, string userId);
        IQueryable<UserReponseViewModel> GetAllUsers(int? labId, params string[] exceptUserIds);
        string GetUserIdByEmail(string email);
        string GetUserIdByUsername(string username);
        bool AddUserInLabs(string userId, params int[] labIds);
        string GenerateRequestTicket(string userId, TicketType ticketType, TimeSpan? timeSpan);
        bool DeleteUserById(string userId, int labId);
        IdentityResult DeleteUser(string id);
        bool IsEmailAlreadySigned(string email);
        bool IsUsernameAlreadySigned(string userName);
        UserType? GetUserTypeById(string userId);
        bool ActivationUserById(string userId, bool isActive);
        bool BulkUsersActivation(BulkUserActivation bulkUserActivationModel);
        List<ModuleWithClaims> GetClaimsByUserId(string userId);
        LoggedInUserInformation GetLoggedInUserInfo(string userId);
        string[] GetFacilityUserIds(int facilityId);
        string[] GetLabsForExpressionTesting();
    }
}
