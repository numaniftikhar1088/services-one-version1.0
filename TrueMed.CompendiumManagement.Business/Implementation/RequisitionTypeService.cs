using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;

namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class RequisitionTypeService : IRequisitionTypeService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ApplicationDbContext _dbContext;
        public RequisitionTypeService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor) {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _utilityService = utilityService;
            _httpContextAccessor = httpContextAccessor;
            //    LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public async Task<RequestResponse<List<RequisitionTypeLookup>>> RequisitionTypeLookupAsync()
        {
                var response = new RequestResponse<List<RequisitionTypeLookup>>();

                var lookupData = await _dbContext.TblLabRequisitionTypes.Select(s => new RequisitionTypeLookup()
                {
                    ReqTypeId = s.ReqTypeId,
                    RequisitionTypeName = s.RequisitionTypeName

                }).ToListAsync();

                response.Data = lookupData;
                response.Status = "Success";
                response.Message = "Request Processed...";
                response.HttpStatusCode = Status.Success;

                return response;
            
        }


    }
}
