using Microsoft.EntityFrameworkCore;
using System.Transactions;
using TrueMed.Business.Interface;
using TrueMed.Domain.Models.Identity;
using TrueMed.Domain.Repositories.Lab.Interface;
using TrueMed.FacilityManagement.Domain.Models.Facility.DTOs;
using TrueMed.FacilityManagement.Domain.Models.Facility.Request;

namespace TrueMed.FacilityManagement.Business.Services.Provider
{
    public static class FacilityProviderManager
    {
        public async static Task<List<KeyValuePairViewModel<string>>>
            GetProvidersBriefByFacilityIdAsync(
            int facilityId, IConnectionManager connectionManager)
        {
            var userManagement = connectionManager.GetService<IUserManagement>();
            var facilityUSerManagement = connectionManager.GetService<IFacilityUserManagement>();
            var facilityUsersIds = await facilityUSerManagement.GetAllProvidersByFacilityIdAsync(facilityId);
            var facilityUsers = await userManagement
                 .GetAllUsers(null).
                 Where(x => facilityUsersIds.Contains(x.Id))
                 .OrderBy(x => x.FirstName).ThenBy(x => x.LastName)
                 .Select(x => new KeyValuePairViewModel<string>()
                 {
                     KeyValue = x.FirstName + " " + x.LastName + " | " + x.AdditionalInfo.NPI,
                     Id = x.Id
                 }).ToListAsync();

            return facilityUsers;
        }

        public static FacilityResult
            SaveRequisitionProviderAndAddInFacilityBrief(int facilityId, RequisitionFacilityProviderViewModel viewModel, IConnectionManager connectionManager)
        {
            var userManagement = connectionManager.GetService<IUserManagement>();
            var facilityUser = connectionManager.GetService<IFacilityUserManagement>();

            using (TransactionScope transactionScope = new TransactionScope(
               TransactionScopeOption.Required,
               new TransactionOptions { IsolationLevel = IsolationLevel.ReadUncommitted },
               TransactionScopeAsyncFlowOption.Enabled))
            {
                var user = new TrueMed.Domain.Model.Identity.ApplicationUser
                {
                    FirstName = viewModel.FirstName,
                    LastName = viewModel.LastName,
                    Username = viewModel.FirstName + "|" + viewModel.LastName + "|" + viewModel.NPI,
                };
                var identityResult = userManagement.RegisterUser(user, null);

                if (identityResult.IsSuccess &&
                    (identityResult = userManagement
                    .UpdateUserAdditionalInfo(new TrueMed.Domain.Model.Identity.UserAdditionalInfo
                {
                    Id = user.Id,
                    NPI = viewModel.NPI
                })).IsSuccess &&
                facilityUser.AddUserInFacilitiesByUserId(user.Id, facilityId)
                )
                {
                    transactionScope.Complete();
                }
                else
                {
                    identityResult.MakeFailed();
                }
                return new FacilityResult(identityResult);
            }
        }
    }
}
