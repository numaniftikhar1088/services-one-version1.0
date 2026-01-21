using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using System.Linq.Expressions;
using TrueMed.Business.Helpers;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Database_Sets.BaseEntity;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.Business.MasterDBContext
{
    public partial class MasterDbContext
    {
        private GlobalFilter _filter;
        public MasterDbContext(DbContextOptions<MasterDbContext> options)
       : base(options)
        {
            _filter = new GlobalFilter();
        }
        public MasterDbContext()
        {

        }
        //public Expression<Func<TEntity, bool>> ApplyGlobalFilters<TEntity>() where TEntity
        //    : class, IGlobalFilterBaseProp
        //{
        //    Expression<Func<TEntity, bool>> expression = null;
        //    Type type = typeof(TEntity);

        //    if (type == typeof(TrueMed.Sevices.MasterEntities.TblLabUser))
        //    {
        //        expression = x => (_filter.LabId > 0 ? x.LabId == _filter.LabId : x.LabId != _filter.LabId) && x.IsActive == true;
        //    }
        //    if (type == typeof(TrueMed.Sevices.MasterEntities.TblLab))
        //    {
        //        expression = x => (_filter.LabId > 0 ? x.LabId == _filter.LabId : x.LabId != _filter.LabId) && x.IsActive == true;
        //    }


        //    return expression;
        //}
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
        {

            //modelBuilder.Entity<TblLabUser>().HasQueryFilter(ApplyGlobalFilters<TblLabUser>()).ToTable(e => e.IsTemporal());
            //modelBuilder.Entity<TblLab>().HasQueryFilter(ApplyGlobalFilters<TblLab>());
            modelBuilder.Entity<TblUser>().HasQueryFilter(x => x.IsDeleted == false);
            //modelBuilder.Entity<TblUserPermission>().HasNoKey();
            modelBuilder.Entity<TblRequestToken>().ToTable(e => e.IsTemporal());
        }
    }
}

