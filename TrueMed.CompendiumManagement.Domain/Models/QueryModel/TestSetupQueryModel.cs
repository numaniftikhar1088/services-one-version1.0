 using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.QueryModel
{
    public class TestSetupQueryModel
    {
        public int TestId { get; set; }
        public string TestName { get; set; }
        public string TestDisplayName { get; set; }
        public string TMITCode { get; set; }
        public string TestType { get; set; }
        public string RequsitionType { get; set; }
        public bool? TestStatus { get; set; }
    }
}
