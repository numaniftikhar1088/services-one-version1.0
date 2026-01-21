using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Business.Interface;
using TrueMed.InsuranceManagement.Business.Interface;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.ResponseModel;

namespace TrueMed.Service.InsuranceManagement.Controllers
{
    [Route("api/OrderInsurance")]
    [ApiController]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Authorize]
    public class OrderInsuranceController : ControllerBase
    {
        private readonly IOrderInsuranceService _orderInsuranceService;
        private readonly ILookupManager _lookupManager;
        private readonly IConnectionManager _connectionManager;
        public OrderInsuranceController(IOrderInsuranceService orderInsuranceService,ILookupManager lookupManager,IConnectionManager connectionManager)
        {

            _orderInsuranceService = orderInsuranceService;
            _connectionManager= connectionManager;
            _lookupManager = lookupManager;
        }
        [HttpPost("SaveOrderInsurance")]
        public async Task<RequestResponse> SaveOrderInsurance(OrderInsuranceSaveDto entity)
        {
            return await _orderInsuranceService.SaveOrderInsuranceAsync(entity);
        }
        [HttpGet("GetInsuranceProviders")]
        public async Task<List<CommonLookupResponse>> GetInsuranceProviders(int typeId)
        {
           return await _lookupManager.GetInsurancesByInsuraceType(typeId, _connectionManager.X_Portal_Key_Value);
        }
        //[HttpGet("GetOrderInsuranceInfoById/{id:int}")]
        //public async Task<RequestResponse<GetOrderInsuranceInfoByIdDto>> GetOrderInsuranceInfoById(int id)
        //{
        //    return await _orderInsuranceService.GetOrderInsuranceInfoByIdAsync(id);
        //}
        [HttpDelete("DeleteOrderInsuranceById/{id:int}")]
        public async Task<RequestResponse> DeleteOrderInsuranceById(int id)
        {
            return await _orderInsuranceService.DeleteOrderInsuranceAsync(id);
        }
  
    
    
    }
}
