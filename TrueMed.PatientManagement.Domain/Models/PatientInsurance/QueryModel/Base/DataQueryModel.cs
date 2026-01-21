using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.QueryModel.Base
{
    public class DataQueryModel<TQueryModel>
    {
        public int PageNumber { get; set; } = 0;
        public int PageSize { get; set; }
        public TQueryModel QueryModel { get; set; }
    }
}
