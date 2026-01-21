using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.QueryModel
{
    public class TestTypeQueryModel
    {
        public int TestTypeId { get; set; }
        public string? TestType { get; set; }
        public bool? Status { get; set; }
    }
}
