using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Request
{
    public class PanelTypeViewModel
    {
        public int? Id { get; set; }
        [Required]
        public string? Name { get; set; }
        public bool? IsActive { get; set; }

    }

    public class UpdatePanelTypeViewModelMetadataType
    {
        [Required]
        public int? Id { get; set; }
    }

    [ModelMetadataType(typeof(UpdatePanelTypeViewModelMetadataType))]
    public class UpdatePanelTypeViewModel : PanelTypeViewModel
    {


    }
}
