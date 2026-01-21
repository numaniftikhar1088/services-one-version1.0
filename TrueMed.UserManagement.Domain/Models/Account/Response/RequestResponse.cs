using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.UserManagement.Domain.Models.Account.Response
{
    public  class RequestResponse
    {
        public object? Data { get; set; }
        public Status StatusCode { get; set; }
        public string ResponseMessage { get; set; }
        public string ResponseStatus { get; set; }
    }
}
