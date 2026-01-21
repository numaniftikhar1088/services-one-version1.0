using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;

namespace TrueMed.Business.Helpers
{
    public class GlobalFilter
    {
        private readonly IDbConnection _masterContext;
        public GlobalFilter()
        {
            _masterContext = new SqlConnection(DBConString.MasterConnection);

            var httpContextAccessor = new HttpContextAccessor();
            var _connectionManager = httpContextAccessor.HttpContext.RequestServices.GetRequiredService<IConnectionManager>();

            FacilityId = _connectionManager.FacilityId;
            LabId = Convert.ToInt32(_connectionManager.LabId);

            var token = httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            if (!string.IsNullOrEmpty(token))
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(token);
                try
                {
                    IsFacilityUser = Convert
                   .ToBoolean(jwtSecurityToken.Payload
                   .FirstOrDefault(x => x.Key == "IsFacilityUser").Value?.ToString());
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message+Environment.NewLine+ex.StackTrace);
                }
               
            }

            _masterContext.Dispose();
        }
        public int? LabId { get; set; }
        public int FacilityId { get; set; }
        public bool IsFacilityUser { get; set; }
        public bool? IsCheckUser { get; set; } = null;
    }
}
