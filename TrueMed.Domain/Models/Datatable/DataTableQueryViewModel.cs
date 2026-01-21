using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Models.Datatable
{
    public class DataQueryViewModel<T>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = int.MaxValue;
        public T? QueryModel { get; set; }
        public string? SortColumn { get; set; }
        public string? SortDirection { get; set; }
    }
    //public enum SortDirection
    //{
    //    asc = 0,
    //    desc = 1
    //}
}
