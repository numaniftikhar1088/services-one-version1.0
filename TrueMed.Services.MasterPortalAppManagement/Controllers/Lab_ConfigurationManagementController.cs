using Microsoft.AspNetCore.Mvc;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.MasterPortalServices.BusinessLayer.Models.Configuration.Request;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Configuration;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    public partial class ConfigurationManagementController
    {
        [HttpGet("Lab/{labKey}/ModulesWithPages")]
        public async Task<IActionResult> GetModulesWithPages(string labKey)
        {
            _connectionManager.EnsureLabByKey(labKey);
            return _aPIResponseViewModel.Create(Request, System.Net.HttpStatusCode.OK,
                await ModuleManagerExtention.GetLabModulesAsync(labKey, _connectionManager));
        }

        [HttpPut("Lab/{labKey}/UpdateModuleVisibility")]
        public async Task<IActionResult> UpdateModulesVisiblity(string labKey, [FromBody] ModuleVisibilityViewModel[] moduleVisibilityViews)
        {
            _connectionManager.EnsureLabByKey(labKey);
            return _aPIResponseViewModel.Create(await ModuleManagerExtention.UpdateModuleVisibilityAsync(labKey, moduleVisibilityViews, _connectionManager));
        }

        [HttpPost("Lab/{labKey}/Module/{moduleName}/Section/Create")]
        public async Task<IActionResult> AddSectionAgainstLab(string labKey, string moduleName, [FromBody] SectionViewModel sectionViewModel)
        {
            _connectionManager.EnsureLabByKey(labKey);
            SectionsManager sectionsManager = new SectionsManager(_connectionManager, labKey);
            return _aPIResponseViewModel.Create(await sectionsManager.AddOrUpdateSectionAsync(moduleName, sectionViewModel, false));
        }

        [HttpPost("Lab/{labKey}/Module/{moduleName}/Section/Update")]
        public async Task<IActionResult> UpdateSectionAgainstLab(string labKey, string moduleName, [FromBody] UpdateSectionViewModel sectionViewModel)
        {
            _connectionManager.EnsureLabByKey(labKey);
            SectionsManager sectionsManager = new SectionsManager(_connectionManager, labKey);
            return _aPIResponseViewModel.Create(await sectionsManager.AddOrUpdateSectionAsync(moduleName, sectionViewModel, true));
        }

        [HttpPost("Lab/{labKey}/Section/{sectionId:int}/Control/Create")]
        public async Task<IActionResult> AddControlAgainstLab(string labKey, int sectionId, [FromBody] ControlViewModel controlViewModel)
        {
            _connectionManager.EnsureLabByKey(labKey);
            ControlsManager controlsManager = new ControlsManager(_connectionManager, labKey);
            return _aPIResponseViewModel.Create(await controlsManager.AddOrUpdateControlAsync(sectionId, controlViewModel, false));
        }

        [HttpPost("Lab/{labKey}/Section/{sectionId:int}/Control/Update")]
        public async Task<IActionResult> UpdateControlAgainstLab(string labKey, int sectionId, [FromBody] UpdateControlViewModel updateControlViewModel)
        {
            _connectionManager.EnsureLabByKey(labKey);
            ControlsManager controlsManager = new ControlsManager(_connectionManager, labKey);
            return _aPIResponseViewModel.Create(await controlsManager.AddOrUpdateControlAsync(sectionId, updateControlViewModel, false));
        }

        [HttpGet("Lab/{labKey}/Module/{moduleName}/Detailed")]
        public async Task<IActionResult> GetModuleDetailed(string labKey, string moduleName)
        {
            _connectionManager.EnsureLabByKey(labKey);
            ModuleManager moduleManager = new ModuleManager(_connectionManager, labKey);
            return _aPIResponseViewModel.Create(Request, System.Net.HttpStatusCode.OK, await moduleManager.GetModule_DetailedByNameAsync(moduleName));
        }



        #region Lookup Section
        [HttpGet("ControlOptionsByLabIdAndControlId_Lookup")]
        public async Task<IActionResult> ControlOptionsByLabIdAndControlId_Lookup([FromQuery] int labId, [FromQuery] int controlId)
        {
            var result = await _lookupManager.ControlOptionsByLabIdAndControlId_Lookup(labId,controlId);
            return Ok(result);
        }
        [HttpGet("ControlOptionsByControlId_Lookup")]
        public async Task<IActionResult> ControlOptionsByControlId_Lookup([FromQuery] int controlId)
        {
            var result = await _lookupManager.ControlOptionsByControlId_Lookup(controlId);
            return Ok(result);
        }
        #endregion
    }
}
