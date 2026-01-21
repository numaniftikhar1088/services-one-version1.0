using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Request.QueryModel.Base
{
    public class DataQueryRequestModel<TRequestModel>
    {
        public int PageNumber { get; set; } = 0;
        public int PageSize { get; set; }
        public TRequestModel QueryModel { get; set; }
    }
}
