using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request
{
    public class ModuleViewModel
    {
        public int? Id { get; set; }
        [Required]
        public string? Name { get; set; }
        public string? Icon { get; set; }
        public int? ParenId { get; set; }
        public int? Order { get;  set; }
    }

    public class UpdateModuleViewModelMetadataType
    {
        [Required]
        public int? Id { get; set; }
    }

    [ModelMetadataType(typeof(UpdateModuleViewModelMetadataType))]
    public class UpdateModuleViewModel : ModuleViewModel
    {

    }
}
