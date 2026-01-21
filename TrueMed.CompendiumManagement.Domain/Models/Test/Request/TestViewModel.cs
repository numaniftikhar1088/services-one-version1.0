using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Request
{
    public class TestViewModel
    {
        public int? Id { get; set; }
        [Required]
        public string? Name { get; set; }
        public string? TMIT_Code { get; set; }
        public int? Department { get; set; }
        [Required]
        public int? RequisitionType { get; set; }
        public bool? IsActive { get; set; } = true;
    }

    public class UpdateTestViewModelMetadataType
    {
        [Required]
        public int? Id { get; set; }
    }


    [ModelMetadataType(typeof(UpdateTestViewModelMetadataType))]
    public class UpdateTestViewModel: TestViewModel
    {

    }
}
