using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Models.Datatable
{
    public class DataReponseViewModel<T>
    {
        public DataReponseViewModel(int total, ICollection<T> data)
        {
            Total = total;
            Data = data;
        }
        public DataReponseViewModel()
        {

        }
        public int Total { get; set; }
        public ICollection<T> Data { get; set; }
    }
}
