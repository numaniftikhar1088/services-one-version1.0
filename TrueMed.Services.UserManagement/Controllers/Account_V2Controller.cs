using Microsoft.AspNetCore.Mvc;
using TrueMed.UserManagement.Business.Services.Interfaces;
using TrueMed.UserManagement.Domain.Models.Dtos.Request;

namespace TrueMed.Services.UserManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Account_V2Controller : ControllerBase
    {
        private readonly IAccountManagement_V2 _accountManagement_V2;

        public Account_V2Controller(IAccountManagement_V2 accountManagement_V2)
        {
            _accountManagement_V2 = accountManagement_V2;
        }
        [HttpGet("TokenForResetPassword")]
        public async Task<IActionResult> TokenForResetPassword(string email, string? portal)
        {
            var response = await _accountManagement_V2.GenerateTokenForResetPsswordAsync(email,portal);
            return Ok(response);
        }
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            var response = await _accountManagement_V2.ResetPsswordAsync(request);
            return Ok(response);
        }
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            var response = await _accountManagement_V2.ChangePasswordAsync(request);
            return Ok(response);
        }
        [HttpPost("InitializePassword")]
        public async Task<IActionResult> InitializePassword(InitializePasswordRequest request)
        {
            var response = await _accountManagement_V2.InitializePsswordAsync(request);
            return Ok(response);
        }
    }
}
