using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Request
{
    public class PanelViewModel
    {
        public int? Id { get; set; }
        [Required]
        public string? Name { get; set; }
        public string? Department { get; set; }
        //[Required]
        //public int? PanelType { get; set; }
        public string? TMIT_Code { get; set; }
        [Required]
        public int? RequisitionType { get; set; }
        public bool? IsActive { get; set; } = true;

    }

    public class UpdatePanelViewModelMetadataType
    {
        [Required]
        public int? Id { get; set; }
    }



    [ModelMetadataType(typeof(UpdatePanelViewModelMetadataType))]
    public class UpdatePanelViewModel : PanelViewModel
    {


    }
}
