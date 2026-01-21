using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Databases;
namespace TrueMed.Domain.Helpers
{
    //public class EnconterConnection : IEnconterConnection
    //{
    //    private ApplicationDBContext _dbContext;
    //    protected IConnectionManager _connectionManager;

    //    #region Constructors
    //    public EnconterConnection(IHttpContextAccessor httpContextAccessor)
    //    {
    //        //_connectionManager = new ConnectionManager(httpContextAccessor);
    //        _dbContext = new ApplicationDBContext(_connectionManager.CONNECTION_STRING);
    //        this.InitializeComponents(_connectionManager, _dbContext);
    //    }

    //    public EnconterConnection(IConnectionManager connectionManager)
    //    {
    //        _connectionManager = connectionManager;
    //        _dbContext = new ApplicationDBContext(_connectionManager.CONNECTION_STRING);
    //        this.InitializeComponents(_connectionManager, _dbContext);
    //    }

    //    public EnconterConnection(IConnectionManager connectionManager, ApplicationDBContext dbContext)
    //    {
    //        _connectionManager = connectionManager;
    //        _dbContext = dbContext;
    //        this.InitializeComponents(_connectionManager, _dbContext);
    //    }

    //    #endregion Constructors

    //    private bool disposed = false;

    //    public ApplicationDBContext DbContext => _dbContext;

    //    protected virtual void Dispose(bool disposing)
    //    {
    //        if (!this.disposed)
    //        {
    //            if (disposing)
    //            {
    //                _dbContext.Dispose();
    //            }
    //        }
    //        this.disposed = true;
    //    }

    //    public void Dispose()
    //    {
    //        Dispose(true);
    //        GC.SuppressFinalize(this);
    //    }

    //    public virtual void InitializeComponents(IConnectionManager connectionManager, ApplicationDBContext dbContext) { }
    //}
}
