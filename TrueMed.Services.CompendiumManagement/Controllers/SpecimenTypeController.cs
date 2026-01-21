using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using TrueMed.CompendiumManagement.Business.Implementation;
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
    [Route("api/SpecimenType")]
    [ApiController]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [HandleException]
    [Authorize]
    public class SpecimenTypeController : ControllerBase
    {
        private readonly ISpecimenTypeService _specimenType;

        public SpecimenTypeController(ISpecimenTypeService specimenType)
        {
            _specimenType = specimenType;
        }
        [HttpPost("SaveSpecimenType")]
        public async Task<RequestResponse> SaveTestType(SaveSpecimenTypeRequest request)
        {
            return await _specimenType.SaveSpecimenTypeAsync(request);
        }
        [HttpPost("GetSpecimenTypeDetail")]
        public async Task<DataQueryResponse<List<GetSpecimenTypeDetailResponse>>> GetSpecimenTypeDetail(DataQueryModel<SpecimenTypeQueryModel> query)
        { 
            return await _specimenType.GetSpecimenTypeDetailAsync(query);
        }
        [HttpDelete("DeleteSpecimenTypeById/{id:int}")]
        public async Task<RequestResponse> DeleteSpecimenTypeById(int id)
        {
            return await _specimenType.DeleteSpecimenTypeByIdAsync(id);
        }
        [HttpPost("ChangeSpecimenTypeStatus")]
        public async Task<RequestResponse> ChangeSpecimenTypeStatus(ChangeSpecimenTypeStatusRequest request)
        {
            return await _specimenType.ChangeSpecimenTypeStatusAsync(request);
        }
        [HttpGet("SpecimenTypeLookup")]
        public async Task<RequestResponse<List<SpecimenTypeLookup>>> SpecimenTypeLookup()
        {
            return await _specimenType.SpecimenTypeLookupAsync();
        }
        [HttpPost("IsSpecimenPreFixExistsAsync")]
        public async Task<bool> IsSpecimenPreFixExistsAsync(string prefix)
        {
            return await _specimenType.IsSpecimenPreFixExistsAsync(prefix);
        }
        [HttpPost("IsSpecimenTypeExistsAsync")]
        public async Task<bool> IsSpecimenTypeExistsAsync(string specimenType)
        {
            return await _specimenType.IsSpecimenTypeExistsAsync(specimenType);
        }
       
    }
}
