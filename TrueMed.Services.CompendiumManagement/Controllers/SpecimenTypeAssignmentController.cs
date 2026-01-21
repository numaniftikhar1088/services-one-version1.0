using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrueMed.Business.Interface;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Models.LookUps.Common;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Route("api/SpecimenTypeAssignment")]
    [ApiController]
    public class SpecimenTypeAssignmentController : ControllerBase
    {
        private readonly ISpecimenTypeAssignmentService _specimenTypeAssignmentService;
        private readonly ILookupManager _lookupManager;

        public SpecimenTypeAssignmentController(ISpecimenTypeAssignmentService specimenTypeAssignmentService, ILookupManager lookupManager)
        {
            _specimenTypeAssignmentService = specimenTypeAssignmentService;
            _lookupManager = lookupManager;
        }
        [HttpPost("SaveSpecimenTypeAssignment")]
        public async Task<RequestResponse> SaveSpecimenTypeAssignment(SpecimenTypeAssignmentRequest request)
        {
            return await _specimenTypeAssignmentService.SaveSpecimenTypeAssignmentAsync(request);
        }
        [HttpPost("GetSpecimenTypeAssignmentDetail")]
        public async Task<DataQueryResponse<List<GetSpecimenTypeAssignmentDetailResponse>>> GetSpecimenTypeAssignmentDetailAsync(DataQueryModel<SpecimenTypeAssignmentQueryModel> query)
        {
            return await _specimenTypeAssignmentService.GetSpecimenTypeAssignmentDetailAsync(query);
        }
        [HttpDelete("DeleteSpecimenTypeAssignmentById/{id:int}")]
        public async Task<RequestResponse> DeleteSpecimenTypeAssignment(int id)
        {
            return await _specimenTypeAssignmentService.DeleteSpecimenTypeAssignmentByIdAsync(id);
        }
        [HttpPost("ChangeSpecimenTypeAssignmentStatus")]
        public async Task<RequestResponse> ChangeSpecimenTypeAssignmentStatusAsync(ChangeSpecimenTypeAssignmentStatusRequest request)
        {
            return await _specimenTypeAssignmentService.ChangeSpecimenTypeAssignmentStatusAsync(request);
        }
        [HttpPost("ImportDataFromExcelToTable")]
        public async Task<RequestResponse> ImportDataFromExcelToTable(List<SpecimenTypeAssignmentImportFromExcelRequest> request)
        {
            return await _specimenTypeAssignmentService.ImportDataFromExcelToTableAsync(request);
        }

        [HttpGet("RequisitionType/Lookup")]
        public async Task<RequestResponse<List<RequisitionTypeLookup>>> RequisitionType()
        {
            return await _specimenTypeAssignmentService.RequisitionTypeLookupAsync();
        }
        [HttpGet("SpecimenType/Lookup")]
        public async Task<RequestResponse<List<SpecimenTypeLookupModel>>> SpecimenType()
        {
            return await _specimenTypeAssignmentService.SpecimenTypeLookupAsync();
        }
        [HttpGet("TestSetup/Lookup")]
        public async Task<RequestResponse<List<TestSetupLookup>>> TestSetup()
        {
            return await _specimenTypeAssignmentService.TestLookupAsync();
        }
        [HttpGet("GetPanelsByReqTypeId/{id:int}")]
        public async Task<RequestResponse<List<PanelLookupModel>>> GetPanelsByReqTypeId(int id)
        {
            return await _specimenTypeAssignmentService.GetPanelsByReqTypeId(id);
        }
        [HttpGet("CompendiumPanel_Lookup")]
        public async Task<List<CommonLookupResponse>> CompendiumPanel_Lookup()
        {
            return await _lookupManager.CompendiumPanel_Lookup();
        }
    }
}
