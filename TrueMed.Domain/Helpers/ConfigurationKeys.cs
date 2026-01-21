using Microsoft.Extensions.Configuration;

namespace TrueMed.Domain.Helpers
{
    public class ConfigurationKeys
    {
        private readonly IConfiguration _configuration;
        public ConfigurationKeys(IConfiguration configuration)
        {
            _configuration = configuration;

            #region REDIS_CONFIGURATION
            REDIS_CONNECTION_STRING = _configuration.GetConnectionString("RedisCache");
            #endregion
            #region EMAIL_CONFIGURATION
            Email.HOST = _configuration.GetSection("MailSettings").GetValue<string>("HostName");
            Email.PORT = _configuration.GetSection("MailSettings").GetValue<int>("Port");
            Email.USERNAME = _configuration.GetSection("MailSettings").GetValue<string>("Username");
            Email.PASSWORD = _configuration.GetSection("MailSettings").GetValue<string>("Password");
            Email.USE_SSL = true;
            Email.FROM_NAME = _configuration.GetSection("MailSettings").GetValue<string>("FromName");
            Email.FROM_ADDRESS = _configuration.GetSection("MailSettings").GetValue<string>("Username");
            #endregion
            #region BLOB STORAGE CONFIGURATION
            BlobStorage.BLOB_CONNECTION_STRING = _configuration?.GetConnectionString("AzureConnectionStringNew");
            #endregion

        }

        #region REDIS_CONFIGURATION_KEYS

        public static string? REDIS_CONNECTION_STRING;

        #endregion
        #region EMAIL_CONFIGURATION_KEYS
        public static class Email
        {
            public static string? HOST { get; set; }
            public static int PORT { get; set; }
            public static string? USERNAME { get; set; }
            public static string? PASSWORD { get; set; }
            public static bool USE_SSL { get; set; }
            public static string? FROM_NAME { get; set; }
            public static string? FROM_ADDRESS { get; set; }
        }
        #endregion
        #region BLOB STORAGE CONFIGURATION_KEYS
        public static class BlobStorage
        {
            public static string? BLOB_CONNECTION_STRING { get; set; }
        }
        #endregion
    }
}
