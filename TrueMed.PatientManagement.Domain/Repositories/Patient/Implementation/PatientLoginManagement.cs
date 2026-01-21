using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TrueMed.Business.Interface;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.PatientManagement.Domain.Models.Patient.Request;
using TrueMed.PatientManagement.Domain.Models.Patient.Response;
using TrueMed.PatientManagement.Domain.QueryModel;
using TrueMed.PatientManagement.Domain.QueryModel.Base;
using TrueMed.PatientManagement.Domain.Repositories.Patient.Interface;
using TrueMed.PatientManagement.Domain.ResponseModel;

namespace TrueMed.PatientManagement.Domain.Repositories.Patient.Implementation
{
    public class PatientLoginManagement : IPatientLoginManagement
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailService;
        private IConfiguration _configuration;
        ApplicationDbContext _applicationDbContext;

        public PatientLoginManagement(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor, IEmailService emailService, IConfiguration configuration)
        {
            _applicationDbContext = ApplicationDbContext.Create(connectionManager);
            this._connectionManager = connectionManager;
            _utilityService = utilityService;
            _httpContextAccessor = httpContextAccessor;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
            _emailService = emailService;
            _configuration = configuration;
        }
        public string LoggedInUser { get; set; }

        public async Task<DataQueryResponse<List<GetPatientLoginUserDetailViewModel>>> GetPatientLoginDetailAsync(DataQueryModel<PatientLoginUserQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetPatientLoginUserDetailViewModel>>();
            var result = await _applicationDbContext.TblPatientLoginUsers.Select(s => new GetPatientLoginUserDetailViewModel()
            {
                Email = s.Email,
                //LoginPassword = s.LoginPassword,
                Mobile = s.Mobile,
                PatientId = Convert.ToInt32(s.PatientId),
                PatientLoginId = s.PatientLoginId,
                UserName = s.UserName
            }).ToListAsync();
            #region Filtered
            if (!string.IsNullOrEmpty(query.QueryModel.UserName))
            {
                result = result.Where(f => f.UserName.Contains(query.QueryModel.UserName)).ToList();
            }
            //if (!string.IsNullOrEmpty(query.QueryModel.LoginPassword))
            //{
            //    result = result.Where(f => f.LoginPassword.Equals(query.QueryModel.LoginPassword)).ToList();
            //}
            if (!string.IsNullOrEmpty(query.QueryModel.Email))
            {
                result = result.Where(f => f.Email.Contains(query.QueryModel.Email)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel.Mobile))
            {
                result = result.Where(f => f.Mobile.Contains(query.QueryModel.Mobile)).ToList();
            }
            if (query.QueryModel.PatientId > 0)
            {
                result = result.Where(f => f.PatientId.Equals(query.QueryModel.PatientId)).ToList();
            }
            if (query.QueryModel.PatientLoginId > 0)
            {
                result = result.Where(f => f.PatientLoginId.Equals(query.QueryModel.PatientLoginId)).ToList();
            }
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                result = result.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion
            response.Total = result.Count;
            response.Data = result;
            return response;
        }

        public async Task<RequestResponse> SavePatientLoginAsync(SavePatientLoginViewModel entity)
        {
            var response = new RequestResponse();
            _applicationDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            var convertedEntity = _utilityService.Converstion<SavePatientLoginViewModel, TblPatientLoginUser>(entity);
            if (convertedEntity.PatientLoginId > 0)
            {
                var recordForEdit = await _applicationDbContext.TblPatientLoginUsers.FindAsync(convertedEntity.PatientLoginId);
                if (recordForEdit != null)
                {
                    recordForEdit = convertedEntity;
                    recordForEdit.UpdatedDate = DateTimeNow.Get;
                    recordForEdit.UpdatedBy = LoggedInUser;
                    recordForEdit.LoginPassword = BCrypt.Net.BCrypt.HashPassword(recordForEdit.LoginPassword);
                    _applicationDbContext.Update(recordForEdit);
                    response.Message = "Record is Updated !";
                }
                else
                {
                    response.Message = "Request Failed !";
                    response.Status = "Failed !";
                    response.HttpStatusCode = Status.Failed;
                    response.Error = $"Record is not exist against ID : {convertedEntity.PatientLoginId} in our system !";
                    return response;
                }
            }
            else
            {
                convertedEntity.LoginPassword = BCrypt.Net.BCrypt.HashPassword(convertedEntity.LoginPassword);
                await _applicationDbContext.AddAsync(convertedEntity);
                response.Message = "Record is Added !";
            }
            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.Status = "Success";
                response.HttpStatusCode = Status.Success;
                #region Email Setting
                var from = _configuration["PatientLoginMailSettings:Username"];
                var username = _configuration["PatientLoginMailSettings:Username"];
                var host = _configuration["PatientLoginMailSettings:HostName"];
                var port = Convert.ToInt32(_configuration["PatientLoginMailSettings:Port"]);
                var password = _configuration["PatientLoginMailSettings:Password"];
                var to = convertedEntity.Email;
                #endregion
                await _emailService.SendEmailAsync(from, to, "Email Subject", "Email Body", host, port, username, password);
            }
            return response;
        }
        public async Task<RequestResponse<bool>> VerifiedPatientLoginUserPasswordAsync(PatientHashedPasswordVerifiedViewModel entity)
        {
            var response = new RequestResponse<bool>();
            if (entity.LoginPassword != null && entity.PatientLoginId != 0)
            {
                var recordForVerifiedPassword = await _applicationDbContext.TblPatientLoginUsers.FindAsync(entity.PatientLoginId);
                if (recordForVerifiedPassword != null)
                {
                    bool isPasswordVerified = BCrypt.Net.BCrypt.Verify(entity.LoginPassword, recordForVerifiedPassword.LoginPassword);
                    if (isPasswordVerified)
                        response.Data = true;
                    else
                        response.Data = false;
                }
                else
                {
                    response.Error = $"Record is not exist against ID : {entity.PatientLoginId} in our system !";
                    response.Status = "Failed !";
                    response.Message = "Request Failed !";
                    response.HttpStatusCode = Status.Failed;
                }

            }
            else
            {
                response.Error = "Provided information is incorrect !";
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
            }
            return response;
        }
    }
}
