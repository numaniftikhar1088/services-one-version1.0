using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using StackExchange.Redis;
using TrueMed.Domain.Helpers;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.RequisitionManagement.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [HandleException]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [ApiController]
    public class PrinterSetupController : ControllerBase
    {
        private readonly IPrinterSetupService _printerSetupService;
        public PrinterSetupController(IPrinterSetupService userService)
        {
            _printerSetupService = userService;
        }

        [HttpPost]
        [Route("GetAll")]
        public DataQueryResponse<List<PrinterSetupResponse>> GetAll(DataQueryModel<PrinterSetupQueryModel> query)
        {
            return _printerSetupService.GetPrinters(query);
        }
        [HttpDelete("DeleteById/{id:int}")]
        public async Task<RequestResponse> DeleteById(int id)
        {
            return await _printerSetupService.DeleteById(id);
        }
        [HttpPost("Save")]
        public async Task<RequestResponse> SavePrinterSetupAsync(PrinterSetupRequest request)
        {
            return await _printerSetupService.SavePrinterSetupAsync(request);
        }
    }
}
