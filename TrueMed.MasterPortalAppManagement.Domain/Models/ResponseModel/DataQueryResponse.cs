using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel
{
    public class DataQueryResponse<TData>
    {
        public int Total { get; set; }
        public TData Data { get; set; }
    }
}
