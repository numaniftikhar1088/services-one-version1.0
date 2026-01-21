using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Database_Sets.BaseEntity;
using TrueMed.Domain.Models.Database_Sets.Application;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace TrueMed.Domain.Databases
{
    public partial class ApplicationDbContext
    {
        private IConnectionManager _connectionManager;
        private GlobalFilter _filter;
        public ApplicationDbContext(IConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }
        public ApplicationDbContext()
        {

        }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
           : base(options)
        {
            _filter = new GlobalFilter();
        }
        public static ApplicationDbContext? Create(IConnectionManager connectionManager)
        {

            if (string.IsNullOrWhiteSpace(connectionManager.CONNECTION_STRING))
            {
                return null;
            }
            //return new ApplicationDbContext(SqlServerDbContextOptionsExtensions.UseSqlServer(new DbContextOptionsBuilder<ApplicationDbContext>(), connectionManager.CONNECTION_STRING, 
            //    opt => 
            //    {
            //        opt.EnableRetryOnFailure(5,TimeSpan.FromSeconds(30),null);
            //        opt.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
            //    }).Options);
            return new ApplicationDbContext(SqlServerDbContextOptionsExtensions.UseSqlServer(new DbContextOptionsBuilder<ApplicationDbContext>(), connectionManager.CONNECTION_STRING).Options);
        }

        public static ApplicationDbContext? Create(string connectionString)
        {
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                return null;
            }
            //return new ApplicationDbContext(SqlServerDbContextOptionsExtensions
            //    .UseSqlServer(new DbContextOptionsBuilder<ApplicationDbContext>(),
            //    connectionString,
            //    opt => 
            //    {
            //        opt.EnableRetryOnFailure(5, TimeSpan.FromSeconds(30), null);
            //        opt.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
            //    }).Options);


            return new ApplicationDbContext(SqlServerDbContextOptionsExtensions
              .UseSqlServer(new DbContextOptionsBuilder<ApplicationDbContext>(),
              connectionString).Options);
        }
        public Expression<Func<TEntity, bool>> ApplyGlobalFilters<TEntity>() where TEntity
           : class, IGlobalFilterBaseProp
        {
            Expression<Func<TEntity, bool>> expression = null;
            Type type = typeof(TEntity);

            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblFacility))
            {
                expression =
                    (
                        e => (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId) && e.IsDeleted == false
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblCompendiumPanelAssignment))
            {
                expression =
                    (
                        e => (_filter.LabId > 0 ? e.ReferenceLabId == _filter.LabId : e.ReferenceLabId != _filter.LabId) && e.IsDeleted == false
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblCompendiumTestConfiguration))
            {
                expression =
                    (
                        e => (_filter.LabId > 0 ? e.ReferenceLabId == _filter.LabId : e.ReferenceLabId != _filter.LabId) && e.IsDeleted == false
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblDrugAllergiesAssignment))
            {
                expression =
                    (
                        e => _filter.IsFacilityUser == true
                        ? (_filter.LabId > 0 ? e.RefLabId == _filter.LabId : e.RefLabId != _filter.LabId)
                        && (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId)
                        && e.IsDeleted == false
                        : (_filter.LabId > 0 ? e.RefLabId == _filter.LabId : e.RefLabId != _filter.LabId)
                        && e.IsDeleted == false
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblFacilityFile))
            {
                expression =
                    (
                        e => _filter.IsFacilityUser == true
                        ? (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId)
                        : e.FacilityId != 0
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblFacilityOption))
            {
                expression =
                    (
                        e => _filter.IsFacilityUser == true
                        ? (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId)
                        : e.FacilityId != 0
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblFacilityRefLabAssignment))
            {
                expression =
                    (
                        e => _filter.IsFacilityUser == true
                        ? (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId) && e.IsDeleted == false
                        : e.FacilityId != 0 && e.IsDeleted == false
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblFacilityUser))
            {
                expression =
                    (
                        e => _filter.IsFacilityUser == true
                        ? (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId)
                        : e.FacilityId != 0
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblFile))
            {
                expression =
                    (
                        e => _filter.IsFacilityUser == true
                        ? (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId) && e.IsDeleted == false
                        : e.FacilityId != 0 && e.IsDeleted == false
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblIcd10assignment))
            {
                expression =
                    (
                         e => _filter.IsFacilityUser == true
                         ? (_filter.LabId > 0 ? e.RefLabId == _filter.LabId : e.RefLabId != _filter.LabId)
                         && (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId)
                         && e.IsDeleted == false
                         : (_filter.LabId > 0 ? e.RefLabId == _filter.LabId : e.RefLabId != _filter.LabId)
                         && e.IsDeleted == false
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblLabAssignment))
            {
                expression =
                    (
                        e => (_filter.LabId > 0 ? e.RefLabId == _filter.LabId : e.RefLabId != _filter.LabId) && e.IsDeleted == false
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblLabFacInsAssignment))
            {
                expression =
                    (
                        e => _filter.IsFacilityUser == true
                        ? (_filter.LabId > 0 ? e.LabId == _filter.LabId : e.LabId != _filter.LabId)
                        && (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId)
                        && e.IsDeleted == false
                        : (_filter.LabId > 0 ? e.LabId == _filter.LabId : e.LabId != _filter.LabId)
                        && e.IsDeleted == false
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblLabRequisitionType))
            {
                expression =
                    (
                        e => (_filter.LabId > 0 ? e.LabId == _filter.LabId : e.LabId != _filter.LabId) && e.IsDeleted == false
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblLabRequisitionTypeWorkflowStatus))
            {
                expression =
                    (
                        e => (_filter.LabId > 0 ? e.LabId == _filter.LabId : e.LabId != _filter.LabId)
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblPatientAddInfo))
            {
                expression =
                    (
                        e => _filter.IsFacilityUser == true
                        ? (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId)
                        : e.FacilityId != 0
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblPatientAddrHistory))
            {
                expression =
                    (
                        e => _filter.IsFacilityUser == true
                        ? (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId)
                        : e.FacilityId != 0
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblRequisitionMaster))
            {
                expression =
                    (
                        e => _filter.IsFacilityUser == true
                        ? (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId) && e.IsDeleted == false
                        : e.FacilityId != 0 && e.IsDeleted == false
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblRequisitionOrder))
            {
                expression =
                    (
                        e => (_filter.LabId > 0 ? e.LabId == _filter.LabId : e.LabId != _filter.LabId) && e.IsDeleted == false
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblShipping))
            {
                expression =
                    (
                        e => _filter.IsFacilityUser == true
                        ? (_filter.FacilityId > 0 ? e.FacilityId == _filter.FacilityId : e.FacilityId != _filter.FacilityId)
                        : e.FacilityId != 0
                    );
            }
            if (type == typeof(TrueMed.Domain.Models.Database_Sets.Application.TblLab))
            {
                expression =
                    (
                        x => (_filter.LabId > 0 ? x.LabId == _filter.LabId : x.LabId != _filter.LabId) && x.IsDeleted == false && x.IsActive == true
                    );
            }
            return expression;
        }
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<TblFacility>().HasQueryFilter(ApplyGlobalFilters<TblFacility>());
            modelBuilder.Entity<TblCompendiumPanelAssignment>().HasQueryFilter(ApplyGlobalFilters<TblCompendiumPanelAssignment>());
            modelBuilder.Entity<TblCompendiumTestConfiguration>().HasQueryFilter(ApplyGlobalFilters<TblCompendiumTestConfiguration>());
            modelBuilder.Entity<TblDrugAllergiesAssignment>().HasQueryFilter(ApplyGlobalFilters<TblDrugAllergiesAssignment>());
            modelBuilder.Entity<TblFacilityFile>().HasQueryFilter(ApplyGlobalFilters<TblFacilityFile>());
            modelBuilder.Entity<TblFacilityOption>().HasQueryFilter(ApplyGlobalFilters<TblFacilityOption>());
            modelBuilder.Entity<TblFacilityRefLabAssignment>().HasQueryFilter(ApplyGlobalFilters<TblFacilityRefLabAssignment>());
            modelBuilder.Entity<TblFacilityUser>().HasQueryFilter(ApplyGlobalFilters<TblFacilityUser>());
            modelBuilder.Entity<TblFile>().HasQueryFilter(ApplyGlobalFilters<TblFile>());
            modelBuilder.Entity<TblIcd10assignment>().HasQueryFilter(ApplyGlobalFilters<TblIcd10assignment>());
            modelBuilder.Entity<TblLabAssignment>().HasQueryFilter(ApplyGlobalFilters<TblLabAssignment>());
            modelBuilder.Entity<TblLabFacInsAssignment>().HasQueryFilter(ApplyGlobalFilters<TblLabFacInsAssignment>());
            modelBuilder.Entity<TblLabRequisitionType>().HasQueryFilter(ApplyGlobalFilters<TblLabRequisitionType>());
            modelBuilder.Entity<TblLabRequisitionTypeWorkflowStatus>().HasQueryFilter(ApplyGlobalFilters<TblLabRequisitionTypeWorkflowStatus>());
            modelBuilder.Entity<TblPatientAddInfo>().HasQueryFilter(ApplyGlobalFilters<TblPatientAddInfo>());
            modelBuilder.Entity<TblPatientAddrHistory>().HasQueryFilter(ApplyGlobalFilters<TblPatientAddrHistory>());
            modelBuilder.Entity<TblRequisitionMaster>().HasQueryFilter(ApplyGlobalFilters<TblRequisitionMaster>());
            modelBuilder.Entity<TblRequisitionOrder>().HasQueryFilter(ApplyGlobalFilters<TblRequisitionOrder>());
            modelBuilder.Entity<TblShipping>().HasQueryFilter(ApplyGlobalFilters<TblShipping>());
            modelBuilder.Entity<TblLab>().HasQueryFilter(ApplyGlobalFilters<TblLab>());



            modelBuilder.Entity<TblRequisition>().HasQueryFilter(e => e.IsDeleted == false);
            modelBuilder.Entity<TblPatientBasicInfo>().HasQueryFilter(e => e.IsDeleted == false);
            modelBuilder.Entity<TblRole>().HasQueryFilter(e => e.IsDeleted == false);
            modelBuilder.Entity<TblPanelType>().HasQueryFilter(e => e.IsDeleted == false);
            modelBuilder.Entity<TblLabRequisitionType>().HasQueryFilter(e => e.IsDeleted == false);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            AuditRelatedScript();
            return base.SaveChangesAsync(cancellationToken);
        }
        public override int SaveChanges()
        {
            AuditRelatedScript();
            return base.SaveChanges();
        }
        private void AuditRelatedScript()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is IAuditProperty && (e.State == EntityState.Added || e.State == EntityState.Modified));


            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Added)
                {
                    //((IAuditProperty)entityEntry.Entity).CreatedBy = _filter.LoggedUserId;
                    ((IAuditProperty)entityEntry.Entity).UpdatedBy = null;
                    ((IAuditProperty)entityEntry.Entity).UpdatedDate = null;
                    ((IAuditProperty)entityEntry.Entity).CreatedDate = DateTimeNow.Get;
                }
                else
                {
                    entityEntry.Context.Entry(((IAuditProperty)entityEntry.Entity)).Property(x => x.CreatedBy).IsModified = false;
                    entityEntry.Context.Entry(((IAuditProperty)entityEntry.Entity)).Property(x => x.CreatedDate).IsModified = false;
                    //((IAuditProperty)entityEntry.Entity).UpdatedBy = _filter.LoggedUserId;
                    ((IAuditProperty)entityEntry.Entity).UpdatedDate = DateTimeNow.Get;
                }
            }
        }
    }
}
