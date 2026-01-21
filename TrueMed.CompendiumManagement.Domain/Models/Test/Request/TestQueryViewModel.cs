using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Request
{
    public class TestQueryViewModel
    {
        public string? Name { get; set; }
        public string? TmitCode { get; set; }
        public int? Department { get; set; }
        public bool? IsActive { get; set; }
    }
}
