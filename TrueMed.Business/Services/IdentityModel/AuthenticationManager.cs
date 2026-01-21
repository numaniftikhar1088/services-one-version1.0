using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Net.Mail;
using System.Text;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.Services.Connection;
using TrueMed.Business.Services.Lab;
using TrueMed.Business.Services.LabRole;
using TrueMed.Business.Services.Secrets;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Helpers.MailClient;
namespace TrueMed.Business.Services.IdentityModel
{
    public static class AuthenticationManager
    {
        public static void AddCustomAuthentication(this IServiceCollection serviceProvider)
        {
            serviceProvider.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.SaveToken = true;
                o.RequireHttpsMetadata = false;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey
                    (Encoding.UTF8.GetBytes(JwtHandler.KEY)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                };
            });
        }

        public static void AddTheServicesRequireds(this WebApplicationBuilder builder)
        {
            builder.Host.ConfigureAppConfiguration((x, y) => y.SetBasePath(AppDomain.CurrentDomain.BaseDirectory).AddJsonFile(
             Path.Combine("AppSettings", "globalconfig.json"), true).Build());
            builder.Services.AddDbContext<MasterDbContext>((options) => options.UseSqlServer(builder.Configuration.GetConnectionString("MasterDBConnectionString")));

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddScoped<JwtHandler>();
            builder.Services.Configure<MailSettings>(
                builder.Configuration.GetSection("MailSettings"));


            builder.Services.AddHttpContextAccessor();
            builder.Services.AddOptions();


            builder.Services.AddScoped<IConnectionManager, ConnectionManager>();
            builder.Services.AddScoped<ILabRoleManagement, LabRoleManagement>();
            builder.Services.AddScoped<IUserManagement, TrueMed.Business.Services.UserManagement.UserManagement>();
            builder.Services.AddScoped<ILaboratoryManagement, LaboratoryManagement>();
          //  builder.Services.AddScoped<ICacheManager, CacheManager>();
            builder.Services.AddScoped<TrueMed.Business.Interface.ICacheManager, TrueMed.Business.Implementation.CacheManager>();
            builder.Services.AddSingleton(new ConfigurationKeys(builder.Configuration));
            builder.Services.AddTransient<TrueMed.Business.Interface.IDapperManager, TrueMed.Business.Implementation.DapperManager>();
            builder.Services.AddScoped<ISecretManagement, SecretManagement>();
            builder.Services.AddTransient<SmtpClient>();
            builder.Services.AddScoped<IEmailManager, EmailManager>();
            //builder.Services.AddScoped<IExternalService, ExternalService>();
            builder.Services.AddScoped<IBlobStorageManager, BlobStorageManager>();

            builder.Services.AddScoped<ApplicationDbContext>(serviceProvider =>
            {
                var connectionManager = serviceProvider.GetService<IConnectionManager>();
                return ApplicationDbContext.Create(connectionManager);
            });
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());



            
        }
    }
}
