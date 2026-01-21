using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;

namespace TrueMed.MasterPortalServices.BusinessLayer.Validation
{
    public class SaveRequisitionTypeValidator : AbstractValidator<SaveRequisitionTypeRequest>
    {
        public SaveRequisitionTypeValidator()
        {
            RuleFor(v => v.RequisitionType).NotEmpty().WithMessage("**Requisition Type is required!");
            RuleFor(v => v.RequisitionTypeName).NotEmpty().WithMessage("**Requisition Type Name is required!");
        }
    }
    public class ChangeRequisitionTypeStatusValidator : AbstractValidator<ChangeRequisitionTypeStatusRequest>
    {
        public ChangeRequisitionTypeStatusValidator()
        {
            RuleFor(v => v.ReqTypeId).NotEmpty().WithMessage("**Requisition Type Id is required!");
            //RuleFor(v => v.RequisitionTypeName).NotEmpty().WithMessage("**Requisition Type Name is required!");
        }
    }
}
