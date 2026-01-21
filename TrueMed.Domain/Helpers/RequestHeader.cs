using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using System.Data;
using TrueMed.Domain.Databases;

namespace TrueMed.Domain.Helpers
{
    public class RequestHeader
    {
        private readonly IDbConnection connection;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public RequestHeader(IHttpContextAccessor httpContextAccessor,string loggedUserId = null)
        {
            connection = new SqlConnection("Data Source=tmitprojectonescus.database.windows.net;Initial Catalog=TMIT-MasterPortal-DB;Integrated Security=false;user=tmituser;password=WaterMark123$$;MultipleActiveResultSets=True");
            _httpContextAccessor = httpContextAccessor;
            LoggedUserId = loggedUserId;

            var adminTypeId = connection.QueryFirstOrDefault<int>($"SELECT AdminType FROM TBLUSER WHERE Id = '{LoggedUserId}'");
            var adminType = connection.QueryFirstOrDefault<string>($"SELECT UserType FROM TBLOPTIONLookup WHERE Id = {adminTypeId}");
            User = adminType;
            if (_httpContextAccessor.HttpContext.Request.Headers.TryGetValue("Facility", out var facilityId))
                FacilityId = Convert.ToInt32(facilityId);
            else
                FacilityId = 0;


            if (_httpContextAccessor.HttpContext.Request.Headers.TryGetValue("Lab", out var Lab))
                LabId = Convert.ToInt32(Lab);
            else
                LabId = 0;
        }
        public static int FacilityId { get; set; }
        public static int? LabId { get; set; }
        public static string? LoggedUserId { get; set; }
        public static string? User { get; set; }
    }
}
