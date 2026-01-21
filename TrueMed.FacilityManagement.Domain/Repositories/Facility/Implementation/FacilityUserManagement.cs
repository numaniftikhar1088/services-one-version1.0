using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Repositories.Lab.Interface;

namespace TrueMed.Domain.Repositories.Lab.Implementation
{
    public partial class FacilityUserManagement : IFacilityUserManagement
    {
        private readonly IConnectionManager _connectionManager;
        private readonly MasterDbContext _masterDbContext;
        private readonly ApplicationDbContext _applicationDbContext;

        public FacilityUserManagement(IConnectionManager connectionManager,
            MasterDbContext masterDbContext,
            ApplicationDbContext applicationDbContext
            )
        {
            this._connectionManager = connectionManager;
            this._masterDbContext = masterDbContext;
            _applicationDbContext = applicationDbContext;
        }

        public bool AddUserInFacilitiesByUserId(string userId, params int[] facilityIds)
        {
            foreach (var facilityId in facilityIds)
            {
                if (!IsUserExistsInFacilityByUserId(userId, facilityId))
                {
                    _applicationDbContext.TblFacilityUsers.Add(new TblFacilityUser()
                    {
                        FacilityId = facilityId,
                        UserId = userId
                    });
                }
            }
            _applicationDbContext.SaveChanges();
            return true;
        }

        public bool IsUserExistsInFacilityByUserId(string userId, int facilityId)
        {
            return _applicationDbContext.TblFacilityUsers.Any(x => x.UserId == userId && x.FacilityId == facilityId);
        }

        public bool RemoveAllUsersByFacilityId(int facilityId)
        {
            var facilityUsers = _applicationDbContext.TblFacilityUsers.Where(x => x.FacilityId == facilityId);
            _applicationDbContext.TblFacilityUsers.RemoveRange(facilityUsers);
            _applicationDbContext.SaveChanges();
            return true;
        }

        public async Task<string[]> GetAllProvidersByFacilityIdAsync(int facilityId)
        {
            return await _applicationDbContext.TblFacilityUsers
                .Where(x => x.FacilityId == facilityId)
                .Select(x => x.UserId)
                .ToArrayAsync();
        }
    }
}
