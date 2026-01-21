using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Helpers;
using TrueMed_Project_One_Service.Helpers;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Route("api/CompendiumPanelSetup")]
    [ApiController]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [HandleException]
    [Authorize]
    public class PanelSetupController : ControllerBase
    {
        private readonly IPanelSetupService _panelSetupService;
        public PanelSetupController(IPanelSetupService panelSetupService)
        {
            _panelSetupService = panelSetupService;
        }
        [HttpPost("Save")]
        public async Task<RequestResponse> SavePanelSetup(SavePanelSetupRequest request)
        {
            return await _panelSetupService.SavePanelSetupAsync(request);
        }
        [HttpPost("GetDetails")]
        [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Client, VaryByQueryKeys = new string[]{ "query" })]
        public async Task<DataQueryResponse<List<GetPanelSetupDetailResponse>>> GetPanelSetupDetail(DataQueryModel<PanelSetupQueryModel> query)
        {
            return await _panelSetupService.GetAllPanelsAsync(query);
        }

        [HttpDelete("DeleteById/{id:int}")]
        public async Task<RequestResponse> DeletePanelSetupById(int id)
        {
            return await _panelSetupService.DeletePanelSetupByIdAsync(id);
        }
        [HttpPost("ChangeStatus")]
        public async Task<RequestResponse> ChangePanelSetupStatus(ChangePanelSetupStatusRequest request)
        {
            return await _panelSetupService.ChangePanelSetupStatusAsync(request);
        }

    }
}
