using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Test.Implementation
{
    public class TestTypeManagement : ITestTypeManagement
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext? _applicationDbContext;

        public TestTypeManagement(
            IConnectionManager connectionManager,
            ApplicationDbContext applicationDbContext
            )
        {
            this._connectionManager = connectionManager;
            _applicationDbContext = applicationDbContext;
        }
        
        public async Task<bool> IsTestTypeExistsByIdAsync(int id)
        {
            return await _applicationDbContext.TblTestTypes.AnyAsync(x => x.TestTypeId == id);
        }
    }
}
