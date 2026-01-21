using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Request
{
    public class PanelGroupViewModel
    {
        public int? Id { get; set; }
        [Required]
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? ReqTypeId { get; set; }
        [Required]
        public bool? IsActive { get; set; }

    }

    public class UpdatePanelGroupViewModelMetadataType
    {
        [Required]
        public int? Id { get; set; }
    }

    [ModelMetadataType(typeof(UpdatePanelGroupViewModelMetadataType))]
    public class UpdatePanelGroupViewModel : PanelGroupViewModel
    {


    }
    public class PanelGroupStatusChangeRequest
    {
        public int Id { get; set; }
        public bool? IsActive { get; set; }
    }
}
