using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Requisition.Request
{
    public class RequisitionTypeViewModel
    {
        public int? Id { get; set; }
        [Required]
        public string? TypeName { get; set; }
        [Required]
        public string? Type { get; set; }
        public bool? IsActive { get; set; } = true;
        public string? RequisitionColor { get; set; }
        public bool IsSelected { get; set; }
        public int? RequisitionId { get; set; }

    }

    public class UpdateRequisitionTypeViewModelMetaDataType
    {
        [Required]
        public int? Id { get; set; }
    }

    [ModelMetadataType(typeof(UpdateRequisitionTypeViewModelMetaDataType))]
    public class UpdateRequisitionTypeViewModel : RequisitionTypeViewModel
    {
        
    }


    public class RequisitionTypeValidation
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public  int Id { get; set; }
    }


}
