using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Response;
using TrueMed.LISManagement.Busines.Interfaces;
using TrueMed.LISManagement.Domain.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domain.DTOS.Response;
using TrueMed.LISManagement.Domains.DTOS.Request;
using TrueMed.LISManagement.Domains.DTOS.Response;

namespace TrueMed.Servicess.LISManagement.Controllers
{
    [Authorize]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Route("api/[controller]")]
    [ApiController]
    public class IDLISPreConfigurationController : ControllerBase
    {
        private readonly IIDLISPreConfiguration _IDLISPreConfiguration;
        public IDLISPreConfigurationController(IIDLISPreConfiguration iDLISPreConfiguration)
        {
            _IDLISPreConfiguration = iDLISPreConfiguration;
        }
        [HttpPost("GetTemplateSettings")]
        public ActionResult<DataQueryResponse<List<IDLISTemplateSettingResponse>>> GetTemplateSettings(DataQueryModel<IDLISTemplateSettingsQM> query)
        {
            return _IDLISPreConfiguration.GetTemplateSettings(query);
        }
        [HttpPost("AddTemplateSettings")]
        public RequestResponse AddTemplateSettings(AddTemplateSettingRequest request)
        {
            return _IDLISPreConfiguration.AddTemplateSettings(request);
        }
        [HttpPost("SaveCells")]
        public RequestResponse SaveCells(List<TemplateCells> request)
        {
            return _IDLISPreConfiguration.SaveCells(request);
        }
        [HttpGet("GetResultDataSettings")]
        public RequestResponse<List<IDLISResultFileConfigurationSetupResponse>> GetResultDataSettings()
        {
            return _IDLISPreConfiguration.GetResultDataSettings();
        }
        [HttpPost("SaveResultDataSettings")]
        public RequestResponse SaveResultDataSettings(List<IDLISResultFileConfigurationSetupResponse> request)
        {
            return _IDLISPreConfiguration.SaveResultDataSettings(request);
        }
    }
}
