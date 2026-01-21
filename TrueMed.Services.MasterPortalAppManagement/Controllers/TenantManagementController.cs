using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TenantManagementController : ControllerBase
    {
        ITenantManger _tenantManger;
        public TenantManagementController(ITenantManger tenantManger)
        {
           _tenantManger=tenantManger;
        }
        [HttpGet("GetLogo")]
        public async Task<IActionResult> GetLogo()
        {
            var result = await _tenantManger.GetLogo();
            return Ok(result);
        }


    }
}
