using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Helpers
{
    public static class JsonConfiguration
    {
        public static IConfiguration ConfigurationContainer { get; private set; }

        public static IConfiguration CreateConfigurationContainer()
        {
            var environment = string.Empty;
            try
            {
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                if (string.IsNullOrWhiteSpace(environment))
                {
                    return ConfigurationContainer = new ConfigurationBuilder()
                        .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                        .AddJsonFile($"AppSettings/appsettings.json").Build();
                }

                return ConfigurationContainer = new ConfigurationBuilder()
                    .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                    .AddJsonFile($"AppSettings/appsettings-{environment}.json").Build();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
