using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using TrueMed.Domain.Helpers;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.RequisitionManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]  
    [Authorize]
    [HandleException]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
  
    public class PateintSignatureController : ControllerBase
    {
        private readonly ISignatureInformationService _signatureInformationService;
        public PateintSignatureController(ISignatureInformationService signatureInformationService)
        {
               _signatureInformationService= signatureInformationService;
        }


        [HttpPost("SaveSignatureInformation")]
        public  async Task<IActionResult> SaveSignatureInfo(SignatureInformationRequest request)
        {
            var result =  await  _signatureInformationService.SavePatientSignatureInformation(request);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);
        }








    }
}
