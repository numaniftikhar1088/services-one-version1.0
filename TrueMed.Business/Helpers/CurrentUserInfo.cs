using Microsoft.AspNetCore.Http;
using TrueMed.Business.Services.Connection;
using TrueMed.Domain.Databases;

namespace TrueMed.Business.Helpers
{
    public class CurrentUserInfo
    {
        public static string UserId { get { return new ConnectionManager(new HttpContextAccessor())?.UserId; } }
    }
}
