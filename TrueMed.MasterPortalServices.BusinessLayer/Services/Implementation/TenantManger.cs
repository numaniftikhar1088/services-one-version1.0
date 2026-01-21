using Azure.Core;
using Microsoft.AspNetCore.Http;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.MasterDBContext;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation
{
    public class TenantManger : ITenantManger
    {
        IHttpContextAccessor _httpContextAccessor;
        MasterDbContext _masterDbContext;
        public TenantManger(IHttpContextAccessor httpContextAccessor,MasterDbContext masterDbContext)
        {
            _httpContextAccessor= httpContextAccessor;
            _masterDbContext = masterDbContext;
        }
        public async Task<string> GetLogo()
        {
            var logo = string.Empty;
           var baseURL = _httpContextAccessor.HttpContext.Request.Headers.Referer.ToString();

            var buri = new Uri(baseURL).Authority;

            logo = _masterDbContext.TblLabs.FirstOrDefault(x => (x.LabUrl??"").ToLower().Trim().Contains(buri.ToLower().Trim()))?.PortalLogo;


          //  if (Uri.Compare(buri, turi, UriComponents.StrongAuthority, UriFormat.SafeUnescaped, StringComparison.OrdinalIgnoreCase) == 0)


                return logo == null ? "https://truemedpo.blob.core.windows.net/tmpologos/logo.png-Ka1keamxUCbn0dwioH6OA-638086042643864146.png" : logo;
        }
    }
}
