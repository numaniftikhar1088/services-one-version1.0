using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Helpers;

namespace TrueMed.Business.Services.MigrationService
{
    public static class MigrationServiceCollectionExtention
    {
        public static IServiceCollection AddAndMigrateTenantDatabases(this WebApplicationBuilder builder)
        {
            //var services = builder.Services;
            //var defaultConnectionString = options.Default?.ConnectionString;
            //var defaultDbProvider = options.Default?.DBProvider;
            //if (defaultDbProvider.ToLower() == "mssql")
            //{
            //    services.AddDbContext<ApplicationDbContext>(m => m.UseSqlServer(e => e.MigrationsAssembly(typeof(Domain.Databases.ApplicationDbContext).Assembly.FullName)));
            //}
            //var tenants = options.Apps;
            //foreach (var tenant in tenants)
            //{
            //    string connectionString;

            //    if (string.IsNullOrEmpty(tenant.LiveDbConnectionString) && string.IsNullOrWhiteSpace(tenant.QADbConnectionString))
            //    {
            //        connectionString = defaultConnectionString;
            //    }
            //    else
            //    {
            //        connectionString = string.IsNullOrWhiteSpace(tenant.LiveDbConnectionString) ? tenant.QADbConnectionString : tenant.LiveDbConnectionString;
            //    }
            //    using var scope = services.BuildServiceProvider().CreateScope();
            //    var dbContext = ApplicationDbContext.Create(tenant.LiveDbConnectionString);
            //    dbContext.Database.SetConnectionString(connectionString);
            //    if (dbContext.Database.GetMigrations().Count() > 0)
            //    {
            //        dbContext.Database.Migrate();
            //    }
            //}
            //return services;
            return null;
        }
        public static T GetOptions<T>(this IServiceCollection services, string sectionName) where T : new()
        {
            using var serviceProvider = services.BuildServiceProvider();
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();
            var section = configuration.GetSection(sectionName);
            var options = new T();
            section.Bind(options);
            return options;
        }

    }
}
