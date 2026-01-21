using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using static System.Collections.Specialized.BitVector32;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Configuration
{
    public class ControlsManager : SectionsManager
    {
        public ControlsManager(IConnectionManager connectionManager, string? labKey = null) : base(connectionManager, labKey)
        {
        }

        public async Task<ICollection<ControlModel>?> GetAllControlsBySectionIdAsync(int sectionId)
        {
            var moduleName = await _masterModuleSectionsManagement.GetModuleNameBySectionIdAsync(sectionId);
            return await GetAllControlsBySectionIdAndModuleNameAsync(sectionId, moduleName);
        }

        public async Task<ICollection<ControlModel>?> GetAllControlsBySectionIdAndModuleNameAsync(int sectionId, string moduleName)
        {
            var moduleId = await _moduleManagement.GetModuleIdByNameAsync(moduleName);

            var appSectionControls = await _appSectionControlsManagement
                 .GetAllSectionControls()
                 .FirstOrDefaultAsync(x => x.SectionId == sectionId);

            var masterSectionControls = await _masterSectionControlsManagement
                 .GetAllSectionControls()
                 .FirstOrDefaultAsync(x => x.SectionId == sectionId);

            var appDeninedControls = (await _appModuleChildGrantManagement
                .GetAllDeniedControls()
                .Where(_ => _.ModuleId == moduleId).Select(x=>x.ControlIds).ToListAsync())
                .SelectMany(x => x).ToList();

            var masterDeninedControls = (await _masterModuleChildGrantManagement
                .GetAllDeniedControls()
                .Where(_ => _.ModuleId == moduleId).Select(x=>x.ControlIds).ToListAsync())
                .SelectMany(x => x).ToList();

            var controls = new List<ControlModel>();

            if (appSectionControls != null)
            {
                var controlsFiltered = await _appControlManagement
                    .GetAllControls().Where(x =>
                !appDeninedControls.Contains(x.Id))
                    .Where(x =>
                    appSectionControls.Controls.Contains(x.Id))
                    .ToListAsync();
                controls
                    .AddRange(controlsFiltered);
                controlsFiltered.ForEach(x => x.IsSystemDefined = false);
            }
            if (masterSectionControls != null)
            {
                var controlsFiltered = await _appControlManagement
                    .GetAllControls().Where(x => !masterDeninedControls.Contains(x.Id))
                    .Where(x => masterSectionControls.Controls.Contains(x.Id))
                    .ToListAsync();
                controlsFiltered.ForEach(x => x.IsSystemDefined = true);
                controls
                    .AddRange(controlsFiltered);
            }

            return controls;
        }

        public async Task<IdentityResult> AddOrUpdateControlAsync(int sectionId, ControlViewModel controlViewModel, bool isUserDefined)
        {
            using (TransactionScope transactionScope = new TransactionScope(
                TransactionScopeOption.Required,
                new TransactionOptions { IsolationLevel = IsolationLevel.ReadUncommitted },
                TransactionScopeAsyncFlowOption.Enabled))
            {
                var identityReusult = IdentityResult.FailedResult();
                var isUpdating = controlViewModel is UpdateControlViewModel;
                if (isUpdating)
                {
                    if (isUserDefined == false)
                    {
                        if (!await _masterControlManagement.IsControlExistsByIdAsync((int)controlViewModel.Id))
                            identityReusult.AddError(nameof(controlViewModel.Id), Domain.Model.Identity.Validator.InvalidValue);
                    }
                    else
                    {
                        if (!await _appControlManagement.IsControlExistsByIdAsync((int)controlViewModel.Id))
                            identityReusult.AddError(nameof(controlViewModel.Id), Domain.Model.Identity.Validator.InvalidValue);
                    }
                }

                if (isUserDefined == false)
                {
                    if (!await _masterSectionManagement.IsSectionExistsByIdAsync(sectionId))
                        identityReusult.AddError("SectionId", Domain.Model.Identity.Validator.InvalidValue);
                }
                else
                {
                    if (!await _appSectionManagement.IsSectionExistsByIdAsync(sectionId))
                        identityReusult.AddError("SectionId", Domain.Model.Identity.Validator.InvalidValue);
                }

                if (identityReusult.HasErrors)
                    return identityReusult;

                var isDone = true;

                if (isUserDefined == false)
                {
                    isDone = (await _masterControlManagement.SaveOrUpdateControlAsync(controlViewModel, isUserDefined));
                    if (isDone)
                    {
                        isDone = await _masterSectionControlsManagement
                            .AddControlInSectionByIdAsync(sectionId, (int)controlViewModel.Id);
                        transactionScope.Complete();

                    }
                    else
                        isDone = false;
                }
                else
                {
                    isDone = (await _appControlManagement.SaveOrUpdateControlAsync(controlViewModel, isUserDefined));
                    if (isDone)
                    {
                        isDone = await _appSectionControlsManagement
                              .AddControlInSectionByIdAsync((int)sectionId, (int)controlViewModel.Id);
                        transactionScope.Complete();
                    }
                    else
                        isDone = false;
                }
                identityReusult.UpdateIdentifier(controlViewModel.Id);
                return identityReusult.CreateResponse(isDone);
            }
        }
    }
}
