using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Models.Response
{
    public class RequestResponse<T>
    {
        public string? Message { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public T Data { get; set; }
    }
    public class RequestResponse : RequestResponse<object>
    {
    }
}
