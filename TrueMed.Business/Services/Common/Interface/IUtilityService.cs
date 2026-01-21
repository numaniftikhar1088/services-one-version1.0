using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Business.Services.Common.Interface
{
    public interface IUtilityService
    {
        Destination Converstion<Source, Destination>(Source s);
    }
}
