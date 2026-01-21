using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Response.QueryModel.Base
{
    public class DataQueryResponseModel<TResponseModel>
    {
        public HttpStatusCode StatusCode { get; set; }
        public string? Message { get; set; }
        public int Total { get; set; }
        public TResponseModel Result { get; set; }
    }
}
