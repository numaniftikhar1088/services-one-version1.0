using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;

namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class CompendiumGroupService : ICompendiumGroupService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ApplicationDbContext _dbContext;
        public CompendiumGroupService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor)
        {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _utilityService = utilityService;
            _httpContextAccessor = httpContextAccessor;
        }
        //public async IList<DataQueryResponse<CompendiumGroupViewModel>> GetCompendiumGroups()
        //{
        //    var groups = await _dbContext.TblCompendiumGroups.ToListAsync();


        //    var list = _utilityService.Converstion<List<TblCompendiumGroup>,List<CompendiumGroupViewModel>>(groups);

        //    return list;
        //}

        public async Task<bool> SaveGroupAsync(CompendiumGroupViewModel viewModel)
        {
            throw new NotImplementedException();
        }

        IQueryable<CompendiumGroupViewModel> ICompendiumGroupService.GetCompendiumGroups()
        {
            throw new NotImplementedException();
        }
    }
}
