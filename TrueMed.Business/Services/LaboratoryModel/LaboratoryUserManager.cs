
using TrueMed.Business.Interface;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.Business.Services.LaboratoryModel
{
    public static class LaboratoryUserManager
    {
        public static IdentityResult MakeLabDefaultAgainstUserById(string userId, 
            int labId, IConnectionManager  connectionManager)
        {
            var userManagement = connectionManager.GetService<IUserManagement>();
            var labManagement = connectionManager.GetService<ILaboratoryManagement>();

            var identity = new IdentityResult(Status.Failed, "One or more validation errors");
            if (!labManagement .IsLabExistsById(labId))
                identity.AddError(nameof(labId), Validator.NotFound);

            if (!userManagement.IsUserExistsById(userId))
                identity.AddError(nameof(userId), Validator.NotFound);

            if (identity.HasErrors)
                return identity;

            if(labManagement.HasDefaultLabAgainstUserById(userId) 
                || labManagement.IsUserExistsInLabById(labId, userId))
            {
                labManagement.UpdateDefaultLabAgainstUserById(userId, labId);
                return identity.MakeSuccessed("Default successfully set.");
            }
            else
            {
                var isMasterUser = userManagement.GetUserTypeById(userId) == UserType.Master;
                if (isMasterUser)
                {
                    labManagement.AddDefaultLabAgainstUserById(userId, labId);
                    return identity.MakeSuccessed("Default successfully set.");
                }
                else
                {
                    labManagement.AddDefaultLabAgainstUserById(userId, labId);
                    identity.AddError(nameof(userId), $"User have not access to lab \"{labId}\".");
                    return identity;
                }
            }
        }
    }
}
