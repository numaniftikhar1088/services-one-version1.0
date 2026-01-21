using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.RequisitionManagement.Domain.Models.ResponseModel
{
    public class RequestResponse<T>
    {
        public T Data { get; set; }
        public string Message { get; set; }
        public string Status { get; set; }
        public Status HttpStatusCode { get; set; }
        public object Error { get; set; }
    }
    public class RequestResponse : RequestResponse<object>
    {
    }

}
