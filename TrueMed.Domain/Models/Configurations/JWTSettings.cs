using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Models.Configurations
{
    public class JWTSettings
    {
        public string Key { get; set; }
        public string ISSUER { get; set; }
        public string AUDIENCE { get; set; }
    }
}
