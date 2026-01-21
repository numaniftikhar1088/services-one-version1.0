using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Business.Interface
{
    public interface IConnectionManager
    {
        HttpRequest Request { get; }
        string PortalName { get; }
        string UserId { get; }
        int FacilityId { get; set; }
        int LabId { get; set; }
        Uri ClientDomain { get; }
        bool IsPortalExist { get; }
        string CONNECTION_STRING { get; }
        bool IsTestingEnvironment { get; }
        HttpContext HttpContext { get; }
        SqlConnection CreateConnection();
        T GetService<T>();
        int? GetLabId(string labKey = "");
        void EnsureLabByKey(string labKey);
        string GetLabDomainUrl();
        bool HasLabAccess(string labKey = "");
        void Throw_Invalid_X_Portal_Key_Error(string labKey);
        IConfiguration? Configuration { get; }
        string X_Portal_Key_Value { get; }
        bool IsMasterUser { get; }
        bool IsFacilityUser { get; }
        bool GetFacilityUserORNot();
    }
}
