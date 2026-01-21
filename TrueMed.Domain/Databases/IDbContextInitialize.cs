using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Databases
{
    public interface IDbContextInitialize
    {
        public DbContext DbContext { get; }
        void InitDbContext(DbContext dbContext);
    }
}
