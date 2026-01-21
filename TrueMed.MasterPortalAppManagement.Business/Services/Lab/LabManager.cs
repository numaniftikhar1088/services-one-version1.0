using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Model.Logger;
using TrueMed.Domain.Repositories.Identity.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab;
using TrueMed.MasterPortalAppManagement.Domain.Services.Lab.Interfaces;
using TrueMed.UserManagement.Domain.Models.Identity;

namespace TrueMed.MasterPortalAppManagement.Business.Services.Lab
{
    public static class LabManager
    {
        public static LabIdentityResult CreateLab(LabViewModel labViewModel,
            IConfiguration configuration,
            IUserManagement userManagement,
            ILabManagement labManagement)
        {
            using (TransactionScope transaction = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = IsolationLevel.ReadUncommitted }))
            {
                using (var dbContext = MasterDbContext.Create(configuration))
                {
                    userManagement.InitDbContext(dbContext);
                    labManagement.InitDbContext(dbContext);

                    var labIdentityResult = labManagement.CreateLab(labViewModel);
                    if (!labIdentityResult.IsSuccess)
                    {
                        return labIdentityResult;
                    }

                    var labDirectorId = userManagement.GetUserIdByEmail(labViewModel.LabDirector.EmailAddress);
                    labManagement.AddUsersInLab((int)labIdentityResult.LabId, new List<string> {labDirectorId });

                    transaction.Complete();
                    return labIdentityResult;
                }
            }
        }
    }
}
