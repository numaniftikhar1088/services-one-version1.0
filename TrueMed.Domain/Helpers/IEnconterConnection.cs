using TrueMed.Domain.Repositories.Connection.Interface;

namespace TrueMed.Domain.Helpers
{
    public interface IEnconterConnection : IDisposable
    {
        Databases.ApplicationDbContext DbContext { get; }
        void InitializeComponents(IConnectionManager connectionManager, Databases.ApplicationDbContext dbContext);
    }
}
