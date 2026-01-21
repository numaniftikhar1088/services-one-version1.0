using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using TrueMed.Business.Interface;
using TrueMed.InsuranceManagement.Business.Interface;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;

namespace TrueMed.Service.InsuranceManagement.Controllers
{
    [Route("api/InsuranceType")]
    [ApiController]
    [Authorize]
    public class InsuranceTypeController : ControllerBase
    {
        private readonly IInsuranceSetupService _insuranceSetupService;
        private readonly IEmailManager _emailManager;

        public InsuranceTypeController(IInsuranceSetupService insuranceSetupService, IEmailManager emailManager)
        {
            _insuranceSetupService = insuranceSetupService;
            _emailManager = emailManager;
        }
        [HttpPost("SaveInsuranceType")]
        public async Task<RequestResponse> SaveInsuranceSetup(SaveInsuranceSetupDto saveInsuranceTypeDto)
        {
            return await _insuranceSetupService.SaveInsuranceSetupAsync(saveInsuranceTypeDto);
        }
        [HttpPost("StatusChange")]
        public async Task<RequestResponse> InsuranceSetupStatusChange(ChangeInsuranceSetupStatusDto insuranceSetupDto)
        {
            return await _insuranceSetupService.ChangeInsuranceSetupStatusAsync(insuranceSetupDto);
        }
        //[HttpPost("GetInsuranceType")]
        //public async Task<DataQueryResponse<IQueryable>> GetInsuranceSetup(DataQueryModel<InsuranceSetupQueryModel> dataQueryModel)
        //{
        //    return await _insuranceSetupService.GetInsuranceSetupAsync(dataQueryModel);
        //}
        [HttpGet("GetInsuranceTypeById/{id:int}")]
        public async Task<RequestResponse<GetInsuranceSetupByIdDto>> GetInsuranceSetupById(int id)
        {
            return await _insuranceSetupService.GetInsuranceSetupByIdAsync(id);
        }
        [HttpDelete("DeleteInsuranceType/{id:int}")]
        public async Task<RequestResponse> DeleteInsuranceAssignmentByIdAsync(int id)
        {
            return await _insuranceSetupService.DeleteInsuranceSetupByIdAsync(id);
        }
        [HttpGet("GetInuranceTypeLookup")]
        public async Task<RequestResponse<List<GetInsuranceTypeLookupDto>>> GetInuranceTypeLookup()
        {
            return await _insuranceSetupService.GetInsuranceTypeLookup();
        }
        [HttpPost("GetInsuranceTypeDetail")]
        public async Task<DataQueryResponse<List<GetInsuranceTypeDetailBasedOnSearchDto>>> GetInsuranceTypeDetail(DataQueryModel<InsuranceSetupQueryModel> query)
        {
            return await _insuranceSetupService.GetInsuranceTypeDetailAsync(query);
        }




        //[HttpGet("emailtest")]
        //public async Task<IActionResult> emailtest()
        //{
        //    string body = "https://truemedlims.com/login";
        //    List<string> tos = new List<string>();
        //    tos.Add("farhanjaved482@gmail.com");


        //    List<Attachment> attachments = new List<Attachment>();
        //    attachments.Add(new Attachment(@"C:\Users\emp 2bvt\Downloads\Base64ToXLSX (8).xlsx"));
        //    attachments.Add(new Attachment(@"C:\Users\emp 2bvt\Downloads\logo.png-Ka1keamxUCbn0dwioH6OA-638086042643864146.png"));
        //    attachments.Add(new Attachment(@"C:\Users\emp 2bvt\Downloads\test.rar"));

        //    await _emailManager.SendEmailAsync(tos, "Email Subject", body,attachments: attachments);
        //    return Ok();
        //}
    }
}
