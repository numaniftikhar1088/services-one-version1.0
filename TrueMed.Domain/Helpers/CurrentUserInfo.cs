using Microsoft.AspNetCore.Http;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Repositories.Connection.Implementation;

namespace TrueMed.Domain.Helpers
{
    public class CurrentUserInfo
    {
        public static string UserId { get { return new ConnectionManager(new HttpContextAccessor())?.UserId; } }
    }
}
