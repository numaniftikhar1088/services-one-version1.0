using System.Data;

namespace TrueMed.Business.Interface
{
    public interface IDapperManager
    {
        Task<IReadOnlyList<T>> QueryAsync<T>(string sql, object param = null);
        Task<IReadOnlyList<T>> SP_Execute<T>(string sql, object param = null);
        Task<int> SP_ExecuteNoReturnAsync(string sql, object param = null);
        Task<T> QueryFirstOrDefaultAsync<T>(string sql, object param = null);
        Task<int> ExecuteAsync(string sql,object param = null,IDbTransaction transaction = null);
        Task<IReadOnlyList<T>> SQL_Execute<T>(string sql, object param = null);
    }
}
