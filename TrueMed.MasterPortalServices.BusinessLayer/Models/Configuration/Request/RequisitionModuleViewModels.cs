using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;

namespace TrueMed.MasterPortalServices.BusinessLayer.Models.Configuration.Request
{
    public class RequisitionModuleViewModel : ModuleViewModel, IValidatableObject
    {
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var moduleManagement = validationContext.GetService<IModuleManagement>();
            var requisitionModuleId = moduleManagement.GetModuleIdByNameAsync("requisition").Result;
            if (requisitionModuleId == null)
                yield return new ValidationResult("\"Requisition\" module doesn't exists. please add it before proceeding.");
            ParenId = requisitionModuleId;
        }
    }

    [ModelMetadataType(typeof(UpdateModuleViewModelMetadataType))]
    public class UpdateRequisitionModuleViewModel : RequisitionModuleViewModel
    {

    }
}
