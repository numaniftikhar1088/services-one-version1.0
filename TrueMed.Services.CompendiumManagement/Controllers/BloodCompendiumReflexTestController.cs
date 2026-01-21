using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BloodCompendiumReflexTestController : ControllerBase
    {
        private readonly ICompendiumDependencyReflexService _compendiumDependencyReflexService;

        public BloodCompendiumReflexTestController(ICompendiumDependencyReflexService compendiumDependencyReflexService)
        {
            _compendiumDependencyReflexService = compendiumDependencyReflexService;
        }
        [HttpPost("Save")]
        public async Task<RequestResponse> Save(SaveCompendiumDependencyReflexRequest request)
        {
            return await _compendiumDependencyReflexService.SaveAsync(request); 
        }
        [HttpDelete("Delete/{id:int}")]
        public async Task<RequestResponse> Delete(int id)
        {
            return await _compendiumDependencyReflexService.DeleteAsync(id);
        }
    }
}
