using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Org.BouncyCastle.Utilities.Zlib;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    [Route("api/Department-Prev")]
    [ApiController]
    [Authorize]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;
        private readonly IBlobStorageManager _blobStorageManager;
        public DepartmentController(IDepartmentService departmentService, IBlobStorageManager blobStorageManager)
        {
            _departmentService = departmentService;
            _blobStorageManager = blobStorageManager;
        }
        [HttpPost("SaveDepartment")]
        public async Task<RequestResponse> SaveDepartment(SaveDepartmentRequest request)
        {
            return await _departmentService.SaveDepartmentAsync(request);
        }
        [HttpPost("GetDepartmentDetail")]
        public async Task<DataQueryResponse<List<GetDepartmentDetailResponse>>> GetDepartmentDetail(DataQueryModel<DepartmentQueryModel> query)
        {
            return await _departmentService.GetDepartmentDetailAsync(query);
        }
        [HttpGet("GetDepartmentDetailById/{id:int}")]
        public async Task<RequestResponse<GetDepartmentDetailByIdResponse>> GetDepartmentDetailById(int id)
        {
            return await _departmentService.GetDepartmentDetailByIdAsync(id);
        }
        [HttpDelete("DeleteDepartmentById/{id:int}")]
        public async Task<RequestResponse> DeleteDepartmentById(int id)
        {
            return await _departmentService.DeleteDepartmentByIdAsync(id);
        }
        [HttpPost("ChangeDepartmentStatus")]
        public async Task<RequestResponse> ChangeDepartmentStatus(ChangeDepartmentStatusRequest request)
        {
            return await _departmentService.ChangeDepartmentStatusAsync(request);
        }
    }
}
