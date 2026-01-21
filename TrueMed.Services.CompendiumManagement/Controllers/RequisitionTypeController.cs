using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Helpers;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Route("api/RequisitionType")]
    [ApiController]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [HandleException]
    [Authorize]
    public class RequisitionTypeController : ControllerBase
    {
        private readonly IRequisitionTypeService _requisitionTypeService;
        public RequisitionTypeController(IRequisitionTypeService requisitionTypeService)
        {
            _requisitionTypeService=requisitionTypeService;
        }


        [HttpGet("Lookup")]
        public async Task<RequestResponse<List<RequisitionTypeLookup>>> Lookup()
        {
            return await _requisitionTypeService.RequisitionTypeLookupAsync();
        }

    }
}
