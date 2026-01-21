using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;

namespace TrueMed.MasterPortalServices.BusinessLayer.Validation
{
    public class SaveDrugAllergyValidator : AbstractValidator<SaveDrugAllergyRequest>
    {
        public SaveDrugAllergyValidator()
        {
            RuleFor(v => v.Description).NotEmpty().WithMessage("**Description is required!");
            //RuleFor(v => v.IsActive).NotEmpty().WithMessage("**Status is required!");
        }
        
    }
    public class ChangeDrugAllergyStatusValidator : AbstractValidator<ChangeDrugAllergyStatusRequest>
    {
        public ChangeDrugAllergyStatusValidator()
        {
            RuleFor(v => v.Id).NotEmpty().WithMessage("**Drug Allergy Id is required!");
            //RuleFor(v => v.RequisitionTypeName).NotEmpty().WithMessage("**Requisition Type Name is required!");
        }
    }
}
