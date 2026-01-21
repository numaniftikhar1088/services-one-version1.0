using Microsoft.AspNet.Identity;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Response;

using TrueMed.Sevices.MasterEntities;
using TrueMed.UserManagement.Business.Services.Interfaces;
using TrueMed.UserManagement.Domain.Models.Dtos.Request;

namespace TrueMed.UserManagement.Business.Services.Implementations
{
    public class AccountManagement_V2 : IAccountManagement_V2
    {
        private readonly MasterDbContext _masterDbContext;
        private readonly IEmailManager _emailManager;
        private readonly IConnectionManager _connectionManager;

        public AccountManagement_V2(MasterDbContext masterDbContext, IEmailManager emailManager)
        {
            _masterDbContext = masterDbContext;
            _emailManager = emailManager;
        }

        public PasswordHasher PasswordHasher { get { return new PasswordHasher(); } }

        #region Command
        public async Task<RequestResponse> GenerateTokenForResetPsswordAsync(string email, string? portal)
        {
            var response = new RequestResponse();

            if (!string.IsNullOrEmpty(email))
            {
                var isEmailExist = _masterDbContext.TblUsers.Any(c => c.Email.Trim().ToLower() == email.Trim().ToLower());
                if (!isEmailExist)
                {
                    response.Message = $"Sorry Email : {email} is invalid !";
                    response.StatusCode = HttpStatusCode.BadRequest;
                    return response;
                }

                var getUserByEmail = _masterDbContext.TblUsers.FirstOrDefault(f => f.Email.Trim().ToLower() == email.Trim().ToLower());

                var tokenForResetPassword = Guid.NewGuid().ToString();
                var tokenCreatedDate = DateTimeNow.Get;
                var tokenExpirationDate = DateTimeNow.Get.AddHours(1);
                var userId = getUserByEmail?.Id;

                var tblResetPasswordToken = new TblResetPasswordToken()
                {
                    Token = tokenForResetPassword,
                    CreatedDate = tokenCreatedDate,
                    ExpirationDate = tokenExpirationDate,
                    UserId = userId
                };
                await _masterDbContext.TblResetPasswordTokens.AddAsync(tblResetPasswordToken);
                await _masterDbContext.SaveChangesAsync();

                var url = portal.Trim().ToLower() == "Lab".Trim().ToLower()
                    ? $"</br><b>https://tmpotruemeditlabportal-dev.azurewebsites.net/Admin/ResetPassword?id={userId}</b>"
                    : $"</br><b>https://admin.truemedlims.com/ResetPassword/{userId}</b>";
                await _emailManager.SendEmailAsync(new List<string>() { getUserByEmail.Email },"Password Reset - Action Required", $"<br/> We would like to inform you that please reset your password. To reset your password, please click on the following link:<br/> {url}.<br/>Please note that the link is time-sensitive and should be accessed promptly. If you encounter any issues or have any questions, please feel free to contact our support team for assistance.<br/>Thank you.<br/><br/>");

                response.Message = "Token Generated...";
                response.StatusCode = HttpStatusCode.OK;

            }

            return response;
        }

        public async Task<RequestResponse> InitializePsswordAsync(InitializePasswordRequest request)
        {
            var response = new RequestResponse();

            var getUser = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == request.UserId);
            if (getUser != null)
            {
                getUser.PasswordHash = PasswordHasher.HashPassword(request.Password);
                _masterDbContext.TblUsers.Update(getUser);

                var ack = await _masterDbContext.SaveChangesAsync();
                if (ack > 0)
                {

                    response.Message = "Password Set Successfully...";
                    response.StatusCode = HttpStatusCode.OK;
                }
            }

            return response;
        }

        public async Task<RequestResponse> ResetPsswordAsync(ResetPasswordRequest request)
        {
            var response = new RequestResponse();

            var getUser = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == request.UserId);
            if (getUser != null)
            {
                var isTokenValid = _masterDbContext.TblResetPasswordTokens.Any(c => c.ExpirationDate > DateTimeNow.Get && c.UserId == request.UserId);
                if (!isTokenValid)
                {
                    response.Message = "Reset Password Token is expired...";
                    response.StatusCode = HttpStatusCode.BadRequest;
                    return response;
                }

                getUser.PasswordHash = PasswordHasher.HashPassword(request.NewPassword);
                _masterDbContext.TblUsers.Update(getUser);

                var ack = await _masterDbContext.SaveChangesAsync();
                if (ack > 0)
                {
                    var getTokenForDelete = _masterDbContext.TblResetPasswordTokens.FirstOrDefault(f => f.UserId == request.UserId);
                    _masterDbContext.Remove(getTokenForDelete);
                    await _masterDbContext.SaveChangesAsync();

                    response.Message = "Password Reset Successfully...";
                    response.StatusCode = HttpStatusCode.OK;
                }
            }
            else
            {
                response.Message = "User is not exist...";
                response.StatusCode = HttpStatusCode.BadRequest;
            }

            return response;
        }
        public async Task<RequestResponse> ChangePasswordAsync(ChangePasswordRequest request)
        {
            var response = new RequestResponse();

            var getUser = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == request.UserId);
            if (getUser != null)
            {
                var oldPasswordCheck = Convert.ToBoolean(PasswordHasher.VerifyHashedPassword(getUser?.PasswordHash.Trim(), request.OldPassword));
                if (oldPasswordCheck)
                {
                    getUser.PasswordHash = PasswordHasher.HashPassword(request.NewPassword);
                    _masterDbContext.TblUsers.Update(getUser);
                    await _masterDbContext.SaveChangesAsync();

                    response.Message = "Password Changed Successfully...";
                    response.StatusCode = HttpStatusCode.OK;
                }
                else
                {
                    response.Message = "Old Password Is Incorrect...";
                    response.StatusCode = HttpStatusCode.BadRequest;
                }
            }
            return response;
        }
        #endregion
    }
}
