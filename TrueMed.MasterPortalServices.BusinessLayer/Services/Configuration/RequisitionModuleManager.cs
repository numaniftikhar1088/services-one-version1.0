using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Services.Common.Implementation;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;
using TrueMed.MasterPortalServices.BusinessLayer.Models.Configuration.Request;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Configuration
{
    public static partial class ModuleManagerExtention
    {
        public static async Task<CompendiumResult> AddOrUpdateRequisitionModuleAsync(RequisitionModuleViewModel moduleViewModel, IConnectionManager connectionManager)
        {
            var autoMapper = connectionManager.GetService<IUtilityService>();
            var isUpdating = moduleViewModel is UpdateRequisitionModuleViewModel;
            if (!isUpdating)
            {
                return await AddOrUpdateModuleAsync(moduleViewModel, connectionManager);
            }
            else
            {
                return await AddOrUpdateModuleAsync(autoMapper.Converstion<RequisitionModuleViewModel, UpdateModuleViewModel>(moduleViewModel), connectionManager);
            }
        }
    }
}
