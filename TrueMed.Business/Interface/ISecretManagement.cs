using Azure.Security.KeyVault.Secrets;

namespace TrueMed.Business.Interface
{
    public interface ISecretManagement
    {
        KeyVaultSecret? GetSecret(string name);
        Task<KeyVaultSecret?> SetSecretAsync(string name, string value);
    }
}
