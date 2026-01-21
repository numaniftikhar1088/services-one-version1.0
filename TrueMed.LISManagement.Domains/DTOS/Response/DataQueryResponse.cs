using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace TrueMed.LISManagement.Domain.DTOS.Response
{
    public class DataQueryResponse<TData>
    {
        public HttpStatusCode StatusCode { get; set; }
        public int Total { get; set; }
        public TData Data { get; set; }
    }
}

