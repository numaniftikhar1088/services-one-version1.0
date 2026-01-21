using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Menu.Request
{
    public class MenuViewModel
    {
        public int? Id { get; set; }
        [Required]
        public string? Name { get; set; }
        public int? Order { get; set; }
        public bool? IsVisible { get; set; } = true;
        [Required]
        public int? ModuleId { get; set; }
        [Required]
        [DataType(DataType.Url)]
        public string? LinkUrl { get; set; }
        public string? MenuIcon { get; set; }

        public bool? IsActive { get; set; }
    }

    public class UpdateMenuViewModelMetadatType
    {
        [Required]
        public int? Id { get; set; }
    }


    [ModelMetadataType(typeof(UpdateMenuViewModelMetadatType))]
    public class UpdateMenuViewModel: MenuViewModel
    {

    }
}
