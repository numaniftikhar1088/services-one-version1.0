using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System.Net.Mime;
using System.Security.Claims;
using System.Security.Principal;
using System.Transactions;
using TrueMed.Business.Interface;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Helpers.MailClient;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Identity;
using TrueMed.Domain.Models.LabRole;
using TrueMed.Domain.Repositories.Identity.Interface;
using TrueMed.Domain.Repositories.Lab.Implementation;
using TrueMed.UserManagement.Domain.Models.Identity;

namespace TrueMed.UserManagement.Business.Services.Identity
{
    public static class Membership
    {
        public static IdentityResultV2
            RegisterMasterUser(RegisterMasterUserViewModel registerAdminUserViewModel,
            IConnectionManager connectionManager)
        {

            using (TransactionScope transaction = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = IsolationLevel.ReadUncommitted }))
            {
                var laboratoryManager = connectionManager.GetService<ILaboratoryManagement>();
                var roleManager = connectionManager.GetService<ILabRoleManagement>();
                var userManager = connectionManager.GetService<IUserManagement>();

                var user = new ApplicationUser()
                {
                    Email = registerAdminUserViewModel.Email,
                    FirstName = registerAdminUserViewModel.FirstName,
                    MiddleName = registerAdminUserViewModel.MiddleName,
                    LastName = registerAdminUserViewModel.LastName,
                    Username = registerAdminUserViewModel.UserName,
                    Phone = registerAdminUserViewModel.Phone,
                    Mobile = registerAdminUserViewModel.Mobile,
                    UserType = UserType.Master,
                    DateOfBirth = registerAdminUserViewModel.DateOfBirth,
                    Address = registerAdminUserViewModel.Address,
                    ProfileImageUrl = registerAdminUserViewModel.ProfileImageUrl,
                    isActive = registerAdminUserViewModel.IsActive
                };
                if (user.isActive == null)
                {
                    user.isActive = true;
                }

                var registerResult = userManager.RegisterUser(user, "Test@123");
                if (!registerResult.IsSuccess)
                {
                    return registerResult.GenerateV2(user);
                }

                userManager.AddUserInLabs(user.Id, registerAdminUserViewModel.LabIds);

                transaction.Complete();
                return registerResult.GenerateV2(user);
            }
        }

        public static async Task<IdentityResultV2>
            RegisterOrUpdateLabUserAsync(LabUserViewModel labUserViewModel,
            IConnectionManager connectionManager)
        {
            var isUpdating = labUserViewModel is UpdateLabUserViewModel;


            using (TransactionScope transactionScope = new TransactionScope(TransactionScopeOption.Required,
                new TransactionOptions() { IsolationLevel = IsolationLevel.ReadUncommitted }, TransactionScopeAsyncFlowOption.Enabled))
            {
                var laboratoryManagement = connectionManager.GetService<ILaboratoryManagement>();
                var roleManagement = connectionManager.GetService<ILabRoleManagement>();
                var userManagement = connectionManager.GetService<IUserManagement>();
                var facilityUserManagement = connectionManager.GetService<FacilityUserManagement>();
                var emailManager = connectionManager.GetService<IEmailManager>();
                //Custom validation like if user is physician, if is updaing then the Email validation etc
                #region custom-validation
                var Identity = new IdentityResult(Status.Failed, "one or more validation errors.");

                //if user is Physician, then facilities required
                if (labUserViewModel.RoleType == Roles.Physician)
                {
                    if (labUserViewModel.FacilitiesIds == null || labUserViewModel.FacilitiesIds.Length <= 0)
                        Identity.AddError(nameof(labUserViewModel.FacilitiesIds), "FacilitiesIds field is Required.");

                    //if user is Doctor/Physician as a sub role, the NPI and StateLicenseNo required.
                    if (await roleManagement.IsRoleExistsByIdAsync(labUserViewModel.RoleId ?? 0))
                    {
                        if (string.IsNullOrWhiteSpace(labUserViewModel.StateLicenseNo))
                            Identity.AddError(nameof(labUserViewModel.StateLicenseNo), $"{nameof(labUserViewModel.StateLicenseNo)} field is Required.");
                        if (string.IsNullOrWhiteSpace(labUserViewModel.NPI))
                            Identity.AddError(nameof(labUserViewModel.NPI), $"{nameof(labUserViewModel.NPI)} field is Required.");
                    }
                }


                //if user is activating the account using username, then username should unique and valid as well as password requird.
                if (labUserViewModel.ActivationType == AccountActivationType.Username)
                {
                    if (string.IsNullOrWhiteSpace(labUserViewModel.UserName))
                    {
                        Identity.AddError(nameof(labUserViewModel.UserName), Validator.Required);
                    }
                    else
                    {
                        //if is updating then validation based on, with Id
                        var isUsernameValid = userManagement.IsUserNameValid(new KeyValuePairViewModel<string?>
                        {
                            Id = isUpdating ? ((UpdateLabUserViewModel)labUserViewModel).Id : "",
                            KeyValue = labUserViewModel.UserName
                        });
                        if (!isUsernameValid)
                        {
                            Identity.AddError(nameof(labUserViewModel.UserName), Validator.AlreadyFound);
                        }
                    }

                    if (string.IsNullOrWhiteSpace(labUserViewModel.Password))
                    {
                        Identity.AddError(nameof(labUserViewModel.Password), Validator.Required);
                    }
                }
                //else email will be used as activating the account
                else
                {
                    if (string.IsNullOrWhiteSpace(labUserViewModel.Email))
                    {
                        Identity.AddError(nameof(labUserViewModel.Email), Validator.Required);
                    }
                    else
                    {
                        //if is updating then validation based on, with Id
                        var isEmailValid = userManagement.IsUserEmailValid(new KeyValuePairViewModel<string?>
                        {
                            Id = isUpdating ? ((UpdateLabUserViewModel)labUserViewModel).Id : "",
                            KeyValue = labUserViewModel.Email
                        });
                        if (!isEmailValid)
                        {
                            Identity.AddError(nameof(labUserViewModel.Email), Validator.AlreadyFound);
                        }
                    }

                    labUserViewModel.Password = string.Empty;
                }

                if (Identity.HasErrors)
                {
                    return Identity.GenerateV2();
                }
                #endregion custom-validation


                var user = new ApplicationUser()
                {
                    Email = labUserViewModel.Email,
                    FirstName = labUserViewModel.FirstName,
                    MiddleName = labUserViewModel.MiddleName,
                    LastName = labUserViewModel.LastName,
                    Username = labUserViewModel.UserName,
                    Phone = labUserViewModel.Phone,
                    Mobile = labUserViewModel.Mobile,
                    UserType = UserType.LabUser,
                    DateOfBirth = labUserViewModel.DateOfBirth,
                    Address = labUserViewModel.Address,
                    ProfileImageUrl = labUserViewModel.ProfileImageUrl,
                    AdminType = labUserViewModel.AdminType
                };

                if (isUpdating)
                {
                    user.Id = ((UpdateLabUserViewModel)labUserViewModel).Id;
                    var updateResult = userManagement.UpdateUser(user, labUserViewModel.Password);
                    if (updateResult.Status != Status.Success)
                    {
                        return updateResult.GenerateV2(user);
                    }
                }
                else
                {
                    var registerResult = userManagement.RegisterUser(user, labUserViewModel.Password);
                    if (registerResult.Status != Status.Success)
                    {
                        return registerResult.GenerateV2(user);
                    }
                    await emailManager.SendEmailAsync(new List<string>() { user.Email }, "Password Initialization - Action Required", $"Dear {user.FirstName},<br/>We would like to inform you that an account has been created for you. To initialize your password and gain access, please click on the following link:<br/> https://tmpotruemeditlabportal-dev.azurewebsites.net/Admin/InitializePassword?id={user.Id}.<br/>Please note that the link is time-sensitive and should be accessed promptly. If you encounter any issues or have any questions, please feel free to contact our support team for assistance.<br/>Thank you.<br/><br/>");
                }

                var additonalInfoResult = userManagement.UpdateUserAdditionalInfo(new UserAdditionalInfo
                {
                    Id = user.Id,
                    IsReferenceLabUser = labUserViewModel.IsReferenceLab ?? false,
                    ReferenceLabName = labUserViewModel.IsReferenceLab == true ? labUserViewModel.ReferenceLabName : "",
                    NPI = labUserViewModel.NPI,
                    StateLicenseNo = labUserViewModel.StateLicenseNo
                });

                if (!additonalInfoResult.IsSuccess)
                    return additonalInfoResult.GenerateV2(user);

                int labId = (int)connectionManager.GetLabId();

                var roleResult = await roleManagement.UpdateUserRoleAndClaimsByUserIdAsync(
                    new UserRoleClaimViewModel
                    {
                       // SubRoleType = Convert.ToInt32(labUserViewModel.SubRoleType),
                       SubRoleType=2,
                        UserId = user.Id,
                        RoleId = (int)labUserViewModel.RoleId,
                        ClaimsIds = await roleManagement.GetClaimsByRoleIdAsync((int)labUserViewModel.RoleId)
                    });

                if (!roleResult.IsSuccess)
                {
                    return roleResult.GenerateV2(user);
                }

                facilityUserManagement.AddUserInFacilitiesByUserId(user.Id, labUserViewModel.FacilitiesIds);

                var isUserExistsInLab = laboratoryManagement.IsUserExistsInLabById(labId, user.Id);
                if (!isUserExistsInLab)
                    userManagement.AddUserInLabs(user.Id, labId);

                transactionScope.Complete();
                labUserViewModel.Id = user.Id;
                roleResult.UpdateIdentifier(user.Id);
                return roleResult.GenerateV2(user);
            }
        }

        public static IdentityResult UpdateMasterUser(UpdateMasterUserViewModel registerAdminUserViewModel,
            IConnectionManager connectionManager)
        {
            using (TransactionScope transaction = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = IsolationLevel.ReadUncommitted }))
            {
                var laboratoryManager = connectionManager.GetService<ILaboratoryManagement>();
                var roleManager = connectionManager.GetService<ILabRoleManagement>();
                var userManager = connectionManager.GetService<IUserManagement>();

                var appUser = new ApplicationUser()
                {
                    FirstName = registerAdminUserViewModel.FirstName,
                    MiddleName = registerAdminUserViewModel.MiddleName,
                    LastName = registerAdminUserViewModel.LastName,
                    Id = registerAdminUserViewModel.Id,
                    Phone = registerAdminUserViewModel.Phone,
                    Mobile = registerAdminUserViewModel.Mobile,
                    UserType = UserType.Master,
                    Address = registerAdminUserViewModel.Address,
                    DateOfBirth = registerAdminUserViewModel.DateOfBirth,
                    ProfileImageUrl = registerAdminUserViewModel.ProfileImageUrl,
                    LabIds = registerAdminUserViewModel.LabIds,
                    Username = registerAdminUserViewModel.UserName,
                    Email = registerAdminUserViewModel.Email
                };
                var user = userManager.UpdateUser(appUser);
                transaction.Complete();
                return user;
            }

        }

        public static IdentityResult DeleteUserByLabKey(string labKey, string userId, IConnectionManager connectionManager)
        {
            var laboratoryManagement = connectionManager.GetService<ILaboratoryManagement>();
            var userManager = connectionManager.GetService<IUserManagement>();

            if (!connectionManager.HasLabAccess(labKey))
            {
                return new IdentityResult(Status.Failed, $"you don't have access to delete the user against lab {labKey}.");
            }

            var isExistUser = laboratoryManagement.IsUserExistsInLabByKey(labKey, userId);
            if (!isExistUser)
                return new IdentityResult(Status.Failed, $"user not found against lab {labKey}.");

            var labId = laboratoryManagement.GetLabIdByKey(labKey);

            userManager.DeleteUserById(userId, (int)labId);

            return new IdentityResult(Status.Success, "Deleted successfully");
        }
        public static IdentityResult DeleteUser(string userId, IConnectionManager connectionManager)
        {
            var userManager = connectionManager.GetService<IUserManagement>();

            var res = userManager.DeleteUser(userId);

            return res;
        }
        public static List<string> GetClaims(this IPrincipal identity)
        {
            var user = identity as ClaimsPrincipal;
            var claim = user.FindAll(ClaimTypes.Actor).Select(x => x.Value);
            return claim.ToList();
        }

        public static bool HasClaim(this IPrincipal identity, string value)
        {
            var user = identity as ClaimsPrincipal;
            var claim = user.FindAll(ClaimTypes.Actor).Where(x => x.Value == value).FirstOrDefault();
            return claim != null;
        }

        public static bool SendAccountActivationEmail(IConnectionManager connectionManager, string portalLink, string portalName, ApplicationUser user, bool isResetEmail = false)
        {
            IUserManagement userManager = connectionManager.GetService<IUserManagement>();
            MailSettings mailSettings = connectionManager.GetService<IOptions<MailSettings>>().Value;
            IConfiguration configuration = connectionManager.GetService<IConfiguration>();
            IWebHostEnvironment webRoot = connectionManager.GetService<IWebHostEnvironment>();

            using (IMailClient mailClient = new MailClient(mailSettings))

            {
                var requestTicket = userManager.GenerateRequestTicket(user.Id, TicketType.NewPassword, TimeSpan.FromDays(1));
                StreamReader streamReader = new StreamReader(webRoot.ContentRootPath + "/Account-Template/temp-account-activation-email.html");
                var emailTemplate = streamReader.ReadToEnd();
                emailTemplate = emailTemplate.Replace("{{PortalName}}", portalName);
                var resourceId = Guid.NewGuid().ToString();
                emailTemplate = emailTemplate.Replace("{{ResourceId}}", resourceId);
                emailTemplate = emailTemplate.Replace("{{Link}}", portalLink + "Verify?ticket=" + requestTicket + "&type=" + (int)TicketType.NewPassword);
                emailTemplate = emailTemplate.Replace("{{clientDomain}}", portalLink);
                mailClient.AddResource(new System.Net.Mail.LinkedResource(fileName: webRoot.ContentRootPath + "/Assets/Images/Laboratory-logo.png", mediaType: MediaTypeNames.Image.Jpeg) { ContentId = resourceId });
                streamReader.Dispose();
                if (!isResetEmail)
                    return mailClient.Send("Account Activation Email", user.Email, emailTemplate);
                else
                    return mailClient.Send("Reset User Account", user.Email, emailTemplate);
            }
        }

        public static async Task<IdentityResult> SetNewPasswordByUserIdAsync(IConnectionManager connectionManager, SetNewPasswordUsingUserIdViewModel passwordViewModel)
        {
            var userManagement = connectionManager.GetService<IUserManagement>();

            IdentityResult identityResult = IdentityResult.FailedResult();
            using (TransactionScope transaction = new TransactionScope(
                TransactionScopeOption.Required,
                new TransactionOptions()
                {
                    IsolationLevel =
                IsolationLevel.ReadUncommitted
                },
                TransactionScopeAsyncFlowOption.Enabled))
            {
                if (!userManagement.IsUserExistsById(passwordViewModel.UserId))
                    identityResult.AddError(nameof(passwordViewModel.UserId), Validator.NotFound);

                if (identityResult.HasErrors)
                    return identityResult;

                return identityResult.CreateResponse(await userManagement.SetNewPasswordByUserIdAsync(passwordViewModel.UserId, passwordViewModel.NewPassword));
            }
        }

        public static IdentityResult SetNewPassword(this IUserManagement manager, SetNewPasswordViewModel passwordViewModel)
        {
            IdentityResult identityResult = null;
            using (TransactionScope transaction = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = IsolationLevel.ReadUncommitted }))
            {
                var ticketUser = manager.ValidateRequestTicket(passwordViewModel.Ticket.Replace(" ", "+"), passwordViewModel.TicketType);
                if (ticketUser == null)
                    return new IdentityResult(Status.InvalidTicket, "Invalid Request Ticket", "Ticket");
                identityResult = manager.SetNewPassword(ticketUser, passwordViewModel.NewPassword, passwordViewModel.Questions);
                if (identityResult.IsSuccess)
                    manager.RemoveRequestTicket(passwordViewModel.Ticket.Replace(" ", "+"), ticketUser.Id);

                identityResult = identityResult.GenerateV2(ticketUser);
                transaction.Complete();
            }
            return identityResult;
        }

    }
}

