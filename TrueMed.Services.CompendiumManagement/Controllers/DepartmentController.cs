using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Helpers;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Route("api/Department")]
    [ApiController]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [HandleException]
    [Authorize]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;
        public DepartmentController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet("Lookup")]
        public async Task<RequestResponse<List<DepartmentLookup>>> Lookup()
        {
            return await _departmentService.DepartmentLookupAsync();
        }

        [HttpPost("SaveOrUpdate")]
        public async Task<RequestResponse> SaveDepartment(SaveDepartmentRequest request)
        {
            return await _departmentService.SaveDepartmentAsync(request);
        }
        [HttpPost("GetDetails")]
        public async Task<DataQueryResponse<List<GetDepartmentDetailResponse>>> GetDepartmentDetail(DataQueryModel<DepartmentQueryModel> query)
        {
            return await _departmentService.GetDepartmentDetailAsync(query);
        }
        [HttpGet("GetDetailById/{id:int}")]
        public async Task<RequestResponse<GetDepartmentDetailResponse>> GetDepartmentDetailById(int id)
        {
            return await _departmentService.GetDepartmentDetailByIdAsync(id);
        }
        [HttpDelete("DeleteById/{id:int}")]
        public async Task<RequestResponse> DeleteDepartmentById(int id)
        {
            return await _departmentService.DeleteDepartmentByIdAsync(id);
        }
        [HttpPost("ChangeStatus")]
        public async Task<RequestResponse> ChangeDepartmentStatus(ChangeDepartmentStatusRequest request)
        {
            return await _departmentService.ChangeDepartmentStatusAsync(request);
        }
    }
}
