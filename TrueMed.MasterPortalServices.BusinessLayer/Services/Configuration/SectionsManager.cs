using Microsoft.EntityFrameworkCore;
using System.Transactions;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Implementation;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Interfaces;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Configuration
{
    public class SectionsManager
    {
        protected readonly IConnectionManager _connectionManager;
        protected readonly ISecretManagement _secretManagement;
        protected readonly ILabManagement _labManagement;
        protected readonly MasterDbContext _masterDbContext;
        protected readonly ApplicationDbContext? _applicationDbContext;
        protected readonly ISectionControlsManagement<ApplicationDbContext> _appSectionControlsManagement;
        protected readonly ISectionManagement<ApplicationDbContext> _appSectionManagement;
        protected readonly IControlManagement<ApplicationDbContext> _appControlManagement;
        protected readonly ISectionControlsManagement<MasterDbContext> _masterSectionControlsManagement;
        protected readonly ISectionManagement<MasterDbContext> _masterSectionManagement;

        protected readonly IControlManagement<MasterDbContext> _masterControlManagement;

        protected readonly IModuleChildGrantManagement<ApplicationDbContext> _appModuleChildGrantManagement;
        protected readonly IModuleChildGrantManagement<MasterDbContext> _masterModuleChildGrantManagement;

        protected readonly IModuleManagement _moduleManagement;
        protected readonly IModuleSectionsManagement<ApplicationDbContext> _appModuleSectionsManagement;
        protected readonly IModuleSectionsManagement<MasterDbContext> _masterModuleSectionsManagement;

        protected readonly IUtilityService _Mapper;

        public SectionsManager(
            IConnectionManager connectionManager,
            string? labKey = null
            )
        {
            this._connectionManager = connectionManager;
            _Mapper = _connectionManager.GetService<IUtilityService>();
            this._secretManagement = connectionManager.GetService<ISecretManagement>();
            this._labManagement = connectionManager.GetService<ILabManagement>();
            this._masterDbContext = connectionManager.GetService<MasterDbContext>();

            if (!string.IsNullOrWhiteSpace(labKey))
            {
                var labConnectionString = _secretManagement.GetSecret(labKey);
                _applicationDbContext = ApplicationDbContext.Create(labConnectionString.Value);

                _appSectionControlsManagement = new SectionControlsManagement<ApplicationDbContext>(connectionManager, _applicationDbContext);
                _appSectionManagement = new SectionManagement<ApplicationDbContext>(connectionManager, _applicationDbContext);
                _appControlManagement = new ControlManagement<ApplicationDbContext>(connectionManager, _applicationDbContext);
                _appModuleChildGrantManagement = new ModuleChildGrantManagement<ApplicationDbContext>(connectionManager, _applicationDbContext);
                _appModuleSectionsManagement = new ModuleSectionsManagement<ApplicationDbContext>(connectionManager, _applicationDbContext);

            }
            _masterSectionControlsManagement = new SectionControlsManagement<MasterDbContext>(connectionManager, _masterDbContext);
            _masterSectionManagement = new SectionManagement<MasterDbContext>(connectionManager, _masterDbContext);
            _masterControlManagement = new ControlManagement<MasterDbContext>(connectionManager, _masterDbContext);
            _masterModuleChildGrantManagement = new ModuleChildGrantManagement<MasterDbContext>(connectionManager, _masterDbContext);
            _moduleManagement = new ModuleManagement(connectionManager, _masterDbContext);
            _masterModuleSectionsManagement = new ModuleSectionsManagement<MasterDbContext>(connectionManager, _masterDbContext);
        }

        public async Task<List<SectionModel>?> GetAllSectionsByModuleNameAsync(string name)
        {
            var moduleId = await _moduleManagement.GetModuleIdByNameAsync(name);
            return await GetAllSectionsByModuleIdAsync((int)moduleId);
        }
        public async Task<List<SectionModel>?> GetAllSectionsByModuleIdAsync(int moduleId)
        {
            List<SectionModel> controlModels = new List<SectionModel>();

            var masterDeniedSectionIds = _masterModuleChildGrantManagement
               .GetAllDeniedSections()
               .Where(_ => _.ModuleId == moduleId)
               .Select(x => x.SectionIds)
               .AsEnumerable()
               .SelectMany(x => x)
               .ToList();

            var appDeniedSectionIds = _appModuleChildGrantManagement
                .GetAllDeniedSections()
                .Where(_ => _.ModuleId == moduleId)
                .Select(x => x.SectionIds)
                .AsEnumerable()
                .SelectMany(x => x)
                .ToList();

            var appSections = await _appSectionManagement
                .GetAllSections()
                .Where(x => !appDeniedSectionIds.Contains(x.Id))
                .ToListAsync();

            var masterSections = await _masterSectionManagement
                .GetAllSections()
                .Where(x => !masterDeniedSectionIds.Contains(x.Id))
                 .ToListAsync();

            appSections.ForEach(x => x.IsSystemDefined = false);
            masterSections.ForEach(x => x.IsSystemDefined = true);

            controlModels.AddRange(appSections);
            controlModels.AddRange(masterSections);
            return controlModels;
        }
        public async Task<IdentityResult> AddOrUpdateSectionAsync(string moduleName, SectionViewModel sectionViewModel, bool isUserDefined)
        {
            using (TransactionScope transactionScope = new TransactionScope(
                TransactionScopeOption.Required,
                new TransactionOptions { IsolationLevel = IsolationLevel.ReadUncommitted },
                TransactionScopeAsyncFlowOption.Enabled))
            {
                var identityReusult = IdentityResult.FailedResult();
                var isUpdating = sectionViewModel is UpdateSectionViewModel;
                if (isUpdating)
                {
                    if (isUserDefined == false)
                    {
                        if (!await _masterSectionManagement.IsSectionExistsByIdAsync((int)sectionViewModel.Id))
                            identityReusult.AddError(nameof(sectionViewModel.Id), Domain.Model.Identity.Validator.InvalidValue);
                    }
                    else
                    {
                        if (!await _appSectionManagement.IsSectionExistsByIdAsync((int)sectionViewModel.Id))
                            identityReusult.AddError(nameof(sectionViewModel.Id), Domain.Model.Identity.Validator.InvalidValue);
                    }
                }

                if (!await _moduleManagement.IsModuleExistsByNameAsync(moduleName))
                {
                    identityReusult.AddError("ModuleName", Domain.Model.Identity.Validator.InvalidValue);
                }

                var moduleId = await _moduleManagement.GetModuleIdByNameAsync(moduleName);

                if (identityReusult.HasErrors)
                    return identityReusult;
                bool isDone = true;

                if (isUserDefined == false)
                {
                    isDone = await _masterSectionManagement.SaveOrUpdateSectionAsync(sectionViewModel);
                    if (!await _masterModuleSectionsManagement.IsSectionExistsInModuleByIdAsync((int)moduleId, (int)sectionViewModel.Id))
                    {
                        await _masterModuleSectionsManagement.AddSectionInModuleByIdAsync((int)moduleId, (int)sectionViewModel.Id);
                    }
                    if (isDone)
                        transactionScope.Complete();
                }
                else
                {
                    isDone = await _appSectionManagement.SaveOrUpdateSectionAsync(sectionViewModel);
                    if (!await _appModuleSectionsManagement.IsSectionExistsInModuleByIdAsync((int)moduleId, (int)sectionViewModel.Id))
                    {
                        await _appModuleSectionsManagement.AddSectionInModuleByIdAsync((int)moduleId, (int)sectionViewModel.Id);
                    }
                    if (isDone)
                        transactionScope.Complete();
                }
                identityReusult.UpdateIdentifier(sectionViewModel.Id);
                return identityReusult.CreateResponse(isDone);
            }
        }

    }
}
