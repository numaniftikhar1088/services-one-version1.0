using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Response
{
    public class TestTypeResponse
    {
        public int TestTypeId { get; set; }
        public string TestType { get; set; } = null!;
        public bool? TestTypeStatus { get; set; }
    }
}
