using Microsoft.AspNetCore.Mvc;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Models.Configuration.Request;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Configuration;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;
using TrueMed.UserManagement.Domain.Models.Account.Response;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    [HandleException]
    [Route("api/Configuration")]
    [ApiController]
    public partial class ConfigurationManagementController : ControllerBase
    {
        readonly APIResponseViewModel _aPIResponseViewModel;
        private readonly IConnectionManager _connectionManager;
        private readonly ILabConfigurationService _labConfigurationService;
        private readonly ILookupManager _lookupManager;
        public ConfigurationManagementController(IConnectionManager connectionManager, ILabConfigurationService labConfigurationService, ILookupManager lookupManager)
        {
            _aPIResponseViewModel = new APIResponseViewModel();
            this._connectionManager = connectionManager;
            _labConfigurationService = labConfigurationService;
            _lookupManager = lookupManager;
        }

        [HttpPost("Modules")]
        public async Task<IActionResult> GetAllModules(DataQueryViewModel<ModuleQueryViewModel> dataQueryView)
        {
            return _aPIResponseViewModel.Create(Request, System.Net.HttpStatusCode.OK, await ModuleManagerExtention.SearchModulesAsync(dataQueryView, _connectionManager));
        }


        [HttpPost("Module/Create")]
        public async Task<IActionResult> AddModule(ModuleViewModel moduleViewModel)
        {
            return _aPIResponseViewModel.Create(await ModuleManagerExtention.AddOrUpdateModuleAsync(moduleViewModel, _connectionManager));
        }

        [HttpPut("Module/Update")]
        public async Task<IActionResult> UpdateModule(UpdateModuleViewModel updateModuleViewModel)
        {
            return _aPIResponseViewModel.Create(await ModuleManagerExtention.AddOrUpdateModuleAsync(updateModuleViewModel, _connectionManager));
        }

        [HttpPost("Requisition/Module/Create")]
        public async Task<IActionResult> AddRequisitionModule(RequisitionModuleViewModel requisitionModuleViewModel)
        {
            return _aPIResponseViewModel.Create(await ModuleManagerExtention.AddOrUpdateRequisitionModuleAsync(requisitionModuleViewModel, _connectionManager));
        }

        [HttpPut("Requisition/Module/Update")]
        public async Task<IActionResult> UpdateRequisitionModule(UpdateRequisitionModuleViewModel requisitionModuleViewModel)
        {
            return _aPIResponseViewModel.Create(await ModuleManagerExtention.AddOrUpdateRequisitionModuleAsync(requisitionModuleViewModel, _connectionManager));
        }

        [HttpPost("Module/{moduleName}/Section/Create")]
        public async Task<IActionResult> AddSection([FromRoute] string moduleName, [FromBody] SectionViewModel sectionViewModel)
        {
            SectionsManager sectionsManager = new SectionsManager(_connectionManager);
            return _aPIResponseViewModel.Create(await sectionsManager.AddOrUpdateSectionAsync(moduleName, sectionViewModel, false));
        }

        [HttpPost("Module/{moduleName}/Section/Update")]
        public async Task<IActionResult> UpdateSection([FromRoute] string moduleName, [FromBody] UpdateSectionViewModel sectionViewModel)
        {
            SectionsManager sectionsManager = new SectionsManager(_connectionManager);
            return _aPIResponseViewModel.Create(await sectionsManager.AddOrUpdateSectionAsync(moduleName, sectionViewModel, true));
        }

        [HttpPost("Section/{sectionId:int}/Control/Create")]
        public async Task<IActionResult> AddControl(int sectionId, [FromBody] ControlViewModel controlViewModel)
        {
            ControlsManager controlsManager = new ControlsManager(_connectionManager);
            return _aPIResponseViewModel.Create(await controlsManager.AddOrUpdateControlAsync(sectionId, controlViewModel, false));
        }

        [HttpPost("Section/{sectionId:int}/Control/Update")]
        public async Task<IActionResult> UpdateControl(int sectionId, [FromBody] UpdateControlViewModel updateControlViewModel)
        {
            ControlsManager controlsManager = new ControlsManager(_connectionManager);
            return _aPIResponseViewModel.Create(await controlsManager.AddOrUpdateControlAsync(sectionId, updateControlViewModel, false));
        }

        [HttpGet("Lab_Configuration/GetSystemFields/{pageId:int}")]
        public IActionResult GetSystemFieldConfigurations(int pageId)
        {
            var result = _labConfigurationService.GetSystemFieldConfigurations(pageId);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);
        }

        [HttpGet("Lab_Configuration/LoadSystemFieldsForClient/{pageId:int}")]
        public IActionResult LoadSystemFieldsForClient(int pageId)
        {
            var result = _labConfigurationService.LoadSystemFieldsForClient(pageId);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);
        }


        [HttpGet("Lab_Configuration/v2/LoadSystemFieldsForClient/{pageId:int}")]
        public IActionResult LoadSystemFieldsForClientV2(int pageId)
        {
            var result = _labConfigurationService.LoadSystemFieldsForClientV2(pageId);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);
        }

        [HttpPost("Lab_Configuration/SaveLabConfiguration")]
        public IActionResult SaveLabConfiguration(SaveLabConfigurationRequest request)
        {
            var result = _labConfigurationService.SaveSectionAndControls(request,_connectionManager);
            if (result.HttpStatusCode == Status.Success)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);
          
        }
        [HttpGet("Deprecated/Lab_Configuration/LoadSystemFields/{pageId:int}")]
        public IActionResult LoadSystemFields(int pageId)
        {
            var result = _labConfigurationService.LoadSystemFields(pageId);
            if (result.HttpStatusCode == Status.Success)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);

        }

        [HttpGet("Lab_Configuration/LoadSystemFields/{pageId:int}")]
        public IActionResult LoadSystemFieldsForAdmin(int pageId)
        {
            var result = _labConfigurationService.LoadSystemFieldsForAdmin(pageId);
            if (result.HttpStatusCode == Status.Success)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);

        }

        [HttpGet("Lab_Configuration/v2/LoadSystemFields/{pageId:int}")]
        public IActionResult LoadSystemFieldsForAdminV2(int pageId)
        {
            var result = _labConfigurationService.LoadSystemFieldsForAdminV2(pageId);
            if (result.HttpStatusCode == Status.Success)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);

        }

        [HttpPost("Lab_Configuration/v2/SaveLabConfiguration")]
        public IActionResult SaveLabConfigurationV2(SaveLabConfigurationRequestV2 request)
        {
            var result = _labConfigurationService.SaveSectionAndControlsV2(request, _connectionManager);
            if (result.HttpStatusCode == Status.Success)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);

        }

        [HttpPost("Lab_Configuration/SaveReqTypes")]
        public IActionResult SaveReqType(List<SaveRequisitionTypeViewModel> request)
        {
            var result = _labConfigurationService.SaveRequisitionTypeForClient(request);
            if (result.HttpStatusCode == Status.Success)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);

        }

        [HttpPost("Lab_Configuration/LoadReqSection")]
        public IActionResult LoadAllReqSection(ReqSectionsViewModel request)
        {
            var result = _labConfigurationService.GetAllReqSections(request);
            if (result.HttpStatusCode == Status.Success)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);

        }

        [HttpPost("Lab_Configuration/LoadCommonSection")]
        public IActionResult LoadAllCommonSection(ReqSectionsViewModel request)
        {
            var result = _labConfigurationService.GetAllCommonSections(request);
            if (result.HttpStatusCode == Status.Success)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);

        }
     

        [HttpGet("Lab_Configuration/ControlTypeLookup")]
        public IActionResult ControlTypeLookup()
        {
            var result = _labConfigurationService.ControlTypeLookup();
            if (result.HttpStatusCode == Status.Success)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);

        }
        [HttpGet("Lab_Configuration/PortalTypeLookup")]
        public IActionResult PortalTypeLookup()
        {
            var result = _labConfigurationService.PortalTypeLookup();
            if (result.HttpStatusCode == Status.Success)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);

        }

        [HttpPost("Lab_Configuration/LoadReqSectionsForClient/{pageId:int}")]
        public IActionResult LoadReqSectionsForClient(ReqSectionsViewModel request)
        {
            var result = _labConfigurationService.LoadReqSectionsForClient(request);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        [HttpPost("GetPortalTypesLookup")]
        public IActionResult GetPortalTypesLookup()
        {
            var result = _labConfigurationService.GetPortalTypesLookup();
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);
        }


    }
}
