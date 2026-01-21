using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request
{
    public class SectionViewModel
    {
        public int? Id { get; set; }

        [Required]
        public string? Name { get; set; }
        [Required]
        public int? Order { get; set; }
    }

    public class UpdateSectionViewModelMetadataType
    {
        [Required]
        public int? Id { get; set; }
    }

    [ModelMetadataType(typeof(UpdateSectionViewModelMetadataType))]
    public class UpdateSectionViewModel : SectionViewModel
    {

    }

    

}
