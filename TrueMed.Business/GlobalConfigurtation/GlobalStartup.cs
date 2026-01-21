using Azure.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.FeatureManagement;
using Microsoft.FeatureManagement.FeatureFilters;
using System.Net.Mail;
using TrueMed.Business.FiltersAndHanldlers;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.Services.Connection;
using TrueMed.Business.Services.FeatureMangament;
using TrueMed.Business.Services.IdentityModel;
using TrueMed.Business.Services.LabRole;
using TrueMed.Business.Services.Secrets;
//using TrueMed.Business.Services.Secrets;
using TrueMed.Business.Services.TokenHelper;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Helpers.MailClient;
using TrueMed.Domain.Models.Configurations;

namespace TrueMed.Business.GlobalConfigurtation
{
    public static class GlobalStartup
    {
        private static IConfigurationRefresher _refresher = null;
        public static void AddGlobalServices(this WebApplicationBuilder builder)
        {





            //builder.Host.ConfigureAppConfiguration((x, y) => y.SetBasePath(AppDomain.CurrentDomain.BaseDirectory).AddJsonFile(
            // Path.Combine("AppSettings", "globalconfig.json"), true).Build());




            // Load configuration from Azure App Configuration
            //builder.Configuration.AddAzureAppConfiguration()

            builder.Configuration.AddAzureAppConfiguration(options =>
            {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                Console.WriteLine("Environment Variable: ====>" + env);
                if (!env.ToLower().Trim().Equals("development"))
                {
                    var credientials = new ManagedIdentityCredential();
                    options.Connect(new Uri("https://tmpoappconfig.azconfig.io"), credientials)
                    .Select("*")
                    .ConfigureRefresh(refresh =>
                    {
                        refresh.Register("refreshAll", true);
                        refresh.SetCacheExpiration(TimeSpan.FromDays(1));


                    });
                    _refresher = options.GetRefresher();
                }
                else
                {
                    options.Connect("Endpoint=https://tmpoappconfig.azconfig.io;Id=8Ory;Secret=WJvluckKbIJHGdBb6ATlfPtpZV5BH5ayK2Wo9UXFHPQ=")
                    .Select("*")
                    .ConfigureRefresh(refresh =>
                    {
                        refresh.SetCacheExpiration(TimeSpan.FromMinutes(60));
                        refresh.Register("refreshAll", true);

                    });
                }
                // Load all feature flags with no label
                options.UseFeatureFlags();
            });
            RegisterRefreshEventHandler();
            builder.Services.AddAzureAppConfiguration();

            // feature flags
            builder.Services.AddFeatureManagement()
                   //  .AddFeatureFilter<BrowserFilter>()
                   .AddFeatureFilter<TimeWindowFilter>()
                   .AddFeatureFilter<PercentageFilter>()
                      .AddFeatureFilter<TargetingFilter>()
                   .UseDisabledFeaturesHandler(new FeatureNotEnabledDisabledHandler());
            builder.Services.AddSingleton<ITargetingContextAccessor, TargetingContextAccessor>();



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
            //  builder.Services.AddScoped<IUserManagement, TrueMed.Domain.Repositories.Identity.Implementation.UserManagement>();
            builder.Services.AddScoped<IUserManagement, TrueMed.Business.Services.UserManagement.UserManagement>();
            //   builder.Services.AddScoped<ILaboratoryManagement, TrueMed.Domain.Repositories.Lab.Implementation.LaboratoryManagement>();
            builder.Services.AddScoped<ILaboratoryManagement, TrueMed.Business.Services.Lab.LaboratoryManagement>();
            // builder.Services.AddScoped<TrueMed.Domain.Repositories.Connection.Interface.ICacheManager, TrueMed.Domain.Repositories.Connection.Implementation.CacheManager>();
            builder.Services.AddScoped<TrueMed.Business.Interface.ICacheManager, TrueMed.Business.Implementation.CacheManager>();
            builder.Services.AddSingleton(new ConfigurationKeys(builder.Configuration));
            builder.Services.AddTransient<TrueMed.Business.Interface.IDapperManager, TrueMed.Business.Implementation.DapperManager>();
            builder.Services.AddScoped<ISecretManagement, SecretManagement>();
            builder.Services.AddTransient<SmtpClient>();
            builder.Services.AddScoped<IEmailManager, EmailManager>();
            //builder.Services.AddScoped<IExternalService, ExternalService>();
            builder.Services.AddScoped<IBlobStorageManager, BlobStorageManager>();
            //  builder.Services.AddScoped<ICacheManager, CacheManager>();
            builder.Services.AddScoped<ApplicationDbContext>(serviceProvider =>
            {
                var connectionManager = serviceProvider.GetService<IConnectionManager>();
                return ApplicationDbContext.Create(connectionManager);
            });
            //var AzureSecret = builder.Configuration.GetValue<string>("AZURE_CLIENT_SECRET");
            //var Azuretanent = builder.Configuration.GetValue<string>("AZURE_TENANT_ID");
            //var Azureclient = builder.Configuration.GetValue<string>("AZURE_CLIENT_ID");

            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            builder.Services.Configure<JWTSettings>(builder.Configuration.GetSection("JWT"));
            builder.Services.AddScoped<ITokenHelper, TokenHelper>();

          

        }

        public static void AddGlobalConfiguration(this WebApplication app)
        {
            app.UseAzureAppConfiguration();


        }

        private static void RegisterRefreshEventHandler()
        {
            //string serviceBusConnectionString = Environment.GetEnvironmentVariable(ServiceBusConnectionStringEnvVarName);
            //string serviceBusTopic = Environment.GetEnvironmentVariable(ServiceBusTopicEnvVarName);
            //string serviceBusSubscription = Environment.GetEnvironmentVariable(ServiceBusSubscriptionEnvVarName);
            //ServiceBusClient serviceBusClient = new ServiceBusClient(serviceBusConnectionString);
            //ServiceBusProcessor serviceBusProcessor = serviceBusClient.CreateProcessor(serviceBusTopic, serviceBusSubscription);

            //serviceBusProcessor.ProcessMessageAsync += (processMessageEventArgs) =>
            //{
            //    // Build EventGridEvent from notification message
            //    EventGridEvent eventGridEvent = EventGridEvent.Parse(BinaryData.FromBytes(processMessageEventArgs.Message.Body));

            //    // Create PushNotification from eventGridEvent
            //    eventGridEvent.TryCreatePushNotification(out PushNotification pushNotification);

            //    // Prompt Configuration Refresh based on the PushNotification
            //    _refresher.ProcessPushNotification(pushNotification);

            //    return Task.CompletedTask;
            //};

            //serviceBusProcessor.ProcessErrorAsync += (exceptionargs) =>
            //{
            //    Console.WriteLine($"{exceptionargs.Exception}");
            //    return Task.CompletedTask;
            //};
        }

    }
}
