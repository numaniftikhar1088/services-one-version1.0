using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DrugAllergyController : Controller
    {
        private readonly IDrugAllergyService _drugAllergyService;
        public DrugAllergyController(IDrugAllergyService drugAllergyService)
        {
            _drugAllergyService = drugAllergyService;
        }
        [HttpPost("Save")]
        public async Task<RequestResponse> SaveDrugAllergy(SaveDrugAllergyRequest request)
        {
            return await _drugAllergyService.SaveDrugAllergyAsync(request);
        }
        [HttpPost("GetAll")]
        public async Task<DataQueryResponse<List<GetDrugAllergiesResponse>>> GetTestSetupDetailAsync(DataQueryModel<DrugAllergyQueryModel> query)
        {
            return await _drugAllergyService.GetDrugAllergiesAsync(query);
        }
        [HttpPost("ChangeStatus")]
        public async Task<RequestResponse> ChangeRequisitionTypeStatus(ChangeDrugAllergyStatusRequest request)
        {
            return await _drugAllergyService.ChangeDrugAllergyStatusAsync(request);
        }
        [HttpDelete("DeleteById/{id:int}")]
        public async Task<RequestResponse> DeleteRequisitionTypeById(int id)
        {
            return await _drugAllergyService.DeleteDrugAllergyByIdAsync(id);
        }
        [HttpPost("IsDescriptionUnique")]
        public async Task<bool> IsDescriptionUnique(string name)
        {
            return await _drugAllergyService.IsDrugAllergiesDescriptionValid(name);
        }
    }
}
