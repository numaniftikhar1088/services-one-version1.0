using Microsoft.AspNetCore.Mvc;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    [Route("api/MenuManagement")]
    [ApiController]
    public class MenuManagementController : ControllerBase
    {
        private readonly IMenuManagement _menuManagementService;
        public MenuManagementController(IMenuManagement menuManagementService)
        {
            _menuManagementService = menuManagementService;
        }
        #region Commands
        [HttpPost("Save")]
        public ActionResult<RequestResponse<int>> Save([FromBody] MenuRequestV2.SaveMenuRequest request)
        {
            return _menuManagementService.Save(request);
        }
        #endregion
        #region Queries
        //public async Task<List<CommonLookupResponse>> Module_Lookup()
        //{
        //    return await _menuManagementService.Module_Lookup();
        //}
        #endregion
        #region Previous Code
        // private readonly APIResponseViewModel _aPIResponseViewModel;
        // private readonly TrueMed.MasterPortalAppManagement.Domain.Repositories.Menu.Interface.IMenuManagement _menuManagement;
        // private readonly IConnectionManager _connectionManager;
        // private readonly TrueMed.MasterPortalServices.BusinessLayer.Services.Interface.IMenuManagement _menuManagementService;

        // public MenuManagementController(TrueMed.MasterPortalAppManagement.Domain.Repositories.Menu.Interface.IMenuManagement menuManagement, 
        //     IConnectionManager connectionManager,
        //     TrueMed.MasterPortalServices.BusinessLayer.Services.Interface.IMenuManagement menuManagementService)
        // {
        //     _aPIResponseViewModel = new APIResponseViewModel();
        //     this._menuManagement = menuManagement;
        //     this._connectionManager = connectionManager;
        //     _menuManagementService = menuManagementService;
        // }
        //[HttpPost("Create")]
        // public async Task<RequestResponse> SaveMenu(MenuRequest menuViewModel)
        // {
        //     return await _menuManagementService.SaveOrUpdatMenuAsync(menuViewModel);
        // }

        // [HttpPost("Update")]
        // public async Task<IActionResult> UpdateMenu(UpdateMenuViewModel menuViewModel)
        // {
        //     return _aPIResponseViewModel.Create(await _menuManagement.SaveOrUpdateMenuAsync(menuViewModel));
        // }

        // //[HttpPost("Menus")]
        // //public async Task<IActionResult> Menus(DataQueryViewModel<MenuQueryViewModel> dataQueryView)
        // //{
        // //    return _aPIResponseViewModel.Create(Request, System.Net.HttpStatusCode.OK, await MenuManager.GetAllMenusAsync(dataQueryView, _connectionManager));
        // //}

        // [HttpPost("IsMenuNameValid")]
        // public async Task<IActionResult> Menus(KeyValuePairViewModel<int?> menuViewModel)
        // {
        //     return _aPIResponseViewModel.Create(await _menuManagement.IsMenuNameValidAsync(menuViewModel));
        // }
        // [HttpPost("Menus")]
        // public async Task<DataQueryResponse<List<GetMenuResponse>>> Menus(DataQueryModel<MenuSetupQueryModel> query)
        // {

        //     var resp = await _menuManagementService.GetMenusbyModule(query);
        //     return resp;
        // }
        // [HttpPost("ChangeStatus")]
        // public async Task<RequestResponse> ChangeStatus(ChangeMenuStatusRequest request)
        // {
        //     return await _menuManagementService.ChangeStatusAsync(request);
        // }
        // [HttpPost("ChangeVisibility")]
        // public async Task<RequestResponse> ChangeVisibility(ChangeMenuVisibilityRequest request)
        // {
        //     return await _menuManagementService.ChangeVisibilityAsync(request);
        // }
        // [HttpGet("ModuleLookup")]
        // public async Task<RequestResponse<List<ModuleLookupModel>>> RequisitionTypeLookup()
        // {
        //     return await _menuManagementService.ModuleLookupAsync();

        // }
        #endregion
    }
}
