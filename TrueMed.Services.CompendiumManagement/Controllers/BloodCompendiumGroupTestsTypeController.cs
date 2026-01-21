using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Helpers;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [HandleException]
    [Authorize]
    public class BloodCompendiumGroupTestsTypeController : ControllerBase
    {
        private readonly IBloodCompendiumGroupTestsType _groupTestsTypeService;

        public BloodCompendiumGroupTestsTypeController(IBloodCompendiumGroupTestsType groupTestsTypeService)
        {
            _groupTestsTypeService = groupTestsTypeService;
        }

        [HttpPost("Save")]
        public async Task<RequestResponse> SaveAsync(SaveGroupTestsTypeRequest request)
        {
            return await _groupTestsTypeService.SaveAsync(request);
        }
        [HttpGet("GetAll")]
        public async Task<RequestResponse> GetAll()
        {
            return await _groupTestsTypeService.GetAllAsync();
        }
    }
}
