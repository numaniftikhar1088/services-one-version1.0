using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class TestLookupsService : ITestLookupsService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private IMapper _mapper;
        private readonly ApplicationDbContext _applicationDbContext;

        public TestLookupsService(IHttpContextAccessor httpContextAccessor, ApplicationDbContext applicationDbContext, IMapper mapper)
        {
            _httpContextAccessor = httpContextAccessor;
            _applicationDbContext = applicationDbContext;
            _mapper = mapper;
        }

        public async Task<RequestResponse<List<DependencyAndReflexTest>>> DependencyAndReflexTestLookupAsync(int performinglabID) 
        {
            var response = new RequestResponse<List<DependencyAndReflexTest>>();

            var data = await _applicationDbContext.TblCompendiumTestConfigurations.Where(x => x.ReferenceLabId == performinglabID)
                .Select(x => new DependencyAndReflexTest
                {
                    TestConfigId = x.Id,
                    TestConfigName = x.TestDisplayName ?? ""
                }).ToListAsync();

            response.Data = data;
            response.Status = "Success";
            response.Message = "Request Processed...";
            response.HttpStatusCode = Status.Success;

            return response;

        }

    }
}
