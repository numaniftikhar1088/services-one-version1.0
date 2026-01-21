using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Interface
{
    public interface ITenantManger
    {
        Task<string> GetLogo();
    }
}
