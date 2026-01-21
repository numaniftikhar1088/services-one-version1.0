using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;
using TrueMed.FacilityManagement.Domain.Enums;

namespace TrueMed.FacilityManagement.Domain.Models.Facility.Response
{
    public class RequestResponse<T>
    {
        public T Data { get; set; }
        public Status StatusCode { get; set; }
        public string ResponseMessage { get; set; }
        public string ResponseStatus { get; set; }
        public string? Error { get; set; }
        public bool IsExist { get; set; }
    }
    public class RequestResponse : RequestResponse<object>
    {
    }
}
