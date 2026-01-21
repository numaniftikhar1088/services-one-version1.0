using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;

namespace TrueMed.Business.Helpers
{
    public interface IEnconterConnection : IDisposable
    {
        ApplicationDbContext DbContext { get; }
        void InitializeComponents(IConnectionManager connectionManager, ApplicationDbContext dbContext);
    }
}
