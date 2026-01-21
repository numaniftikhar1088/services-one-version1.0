using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Azure.Identity;
using Microsoft.Extensions.Azure;
using Microsoft.Graph;

namespace TrueMed.Domain.Helpers
{
    public class AzureKeyVaultConfiguration
    {
        public static void Configure(WebApplication app)
        {
       //     configuration.AddAzureKeyVault(
       //new Uri($"https://{configuration["KeyVaultName"]}.vault.azure.net/"),
       //new DefaultAzureCredential());
        }
    }
}
