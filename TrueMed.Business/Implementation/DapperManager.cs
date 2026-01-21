using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using TrueMed.Business.Interface;

namespace TrueMed.Business.Implementation
{
    public class DapperManager : IDapperManager, IDisposable
    {
        private readonly IDbConnection connection;
        private readonly IConnectionManager _connectionManager;
        public DapperManager(IConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
            connection = new SqlConnection(_connectionManager.CONNECTION_STRING);
        }
        public DapperManager(string CONNECTION_STRING)
        {          
            connection = new SqlConnection(CONNECTION_STRING);
        }
        public async Task<IReadOnlyList<T>> QueryAsync<T>(string sql, object param = null)
        {
            return (await connection.QueryAsync<T>(sql)).AsList();
        }
        public async Task<T> QueryFirstOrDefaultAsync<T>(string sql, object param)
        {
            return await connection.QueryFirstOrDefaultAsync<T>(sql, param);
        }
        public async Task<int> ExecuteAsync(string sql, object param = null, IDbTransaction transaction = null)
        {
            return await connection.ExecuteAsync(sql, param, transaction);
        }
        public void Dispose()
        {
            connection.Dispose();
        }
        public async Task<int> SP_ExecuteNoReturnAsync(string sql, object param = null)
        {
            return await connection.ExecuteAsync(sql, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<IReadOnlyList<T>> SP_Execute<T>(string sql, object param = null)
        {
            return (await connection.QueryAsync<T>(sql,param,commandType:CommandType.StoredProcedure)).AsList();
        }
        public async Task<IReadOnlyList<T>> SQL_Execute<T>(string sql, object param = null)
        {
            return (await connection.QueryAsync<T>(sql, param, commandType: CommandType.Text)).AsList();
        }
    }
}
