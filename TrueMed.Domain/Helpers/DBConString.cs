using TrueMed.Domain.Repositories.Connection.Implementation;

namespace TrueMed.Domain.Helpers
{
    public class DBConString
    {
        public static string GetCurrentTenantConnection(string key)
        {
            var secretMngmnt = new SecretManagement(new CacheManager());
            return secretMngmnt.GetSecret(key)?.Value;
        }
        public static string MasterConnection
        {
            get
            {
                return "Data Source=tmitprojectonescus.database.windows.net;Initial Catalog=TMIT-MasterPortal-DB;Integrated Security=false;user=tmituser;password=WaterMark123$$;MultipleActiveResultSets=True";
            }
        }
    }
}
