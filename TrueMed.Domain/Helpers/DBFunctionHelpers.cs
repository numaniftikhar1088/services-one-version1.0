using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Helpers
{
    public static class DBFunctionHelpers
    {
        [DbFunction("Levenshtein", "dbo")]
        public static int Levenshtein(string s, string t, int d)
        {
            throw new NotImplementedException();
        }
    }
}
