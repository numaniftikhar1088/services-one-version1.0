using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;

namespace TrueMed.Business.Services.Secrets
{
    public class SecretManagement : ISecretManagement
    {
        private readonly ICacheManager _cacheManager;
        private SecretClient _clientSecret;
        public SecretManagement(ICacheManager cacheManager)
        {

            _clientSecret = new SecretClient(vaultUri: new Uri("https://truemedkeyvault.vault.azure.net"), credential: new DefaultAzureCredential());
            _cacheManager = cacheManager;

        }
        //[DebuggerHidden]
        public KeyVaultSecret? GetSecret(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new X_Portal_Key_EXCEPTION("X-Portal-Key required.");

            var cacheResponse = _cacheManager.Get<KeyVaultSecret>(name);

            if (cacheResponse.IsSuccess)
            {
                return cacheResponse.Value;
            }

            var responseResult = _clientSecret.GetSecret(name);

            if (responseResult.Value != null)
            {
                var cacheetResult = _cacheManager.Set<KeyVaultSecret>(name, responseResult.Value);
                if (cacheetResult.IsSuccess)
                    return responseResult.Value;
            }
            return null;
        }

        public async Task<KeyVaultSecret?> SetSecretAsync(string name, string value)
        {
            var responseResult = await _clientSecret.SetSecretAsync(name, value);
            if (responseResult.Value != null)
            {
                return responseResult.Value;
            }
            return null;
        }
    }
}
