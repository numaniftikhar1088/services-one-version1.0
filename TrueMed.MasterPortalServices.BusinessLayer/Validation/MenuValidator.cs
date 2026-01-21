using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;

namespace TrueMed.MasterPortalServices.BusinessLayer.Validation
{
    public class MenuValidator : AbstractValidator<MenuRequest>
    {
        public MenuValidator()
        {
            RuleFor(v => v.MenuName).NotEmpty().WithMessage("**Menu Name is required!");
            RuleFor(v => v.DisplayOrder).NotEmpty().WithMessage("**Display Order is required!");
            RuleFor(v => v.ModuleId).NotEmpty().WithMessage("**Module Id is required!");

        }
    }
    public class ChangeMenuStatusValidator : AbstractValidator<ChangeMenuStatusRequest>
    {
        public ChangeMenuStatusValidator()
        {
            RuleFor(v => v.MenuId).NotEmpty().WithMessage("**Id is required!");
            //RuleFor(v => v.RequisitionTypeName).NotEmpty().WithMessage("**Requisition Type Name is required!");
        }
    }
    public class ChangeMenuVisibilityValidator : AbstractValidator<ChangeMenuVisibilityRequest>
    {
        public ChangeMenuVisibilityValidator()
        {
            RuleFor(v => v.MenuId).NotEmpty().WithMessage("**Id is required!");
            //RuleFor(v => v.RequisitionTypeName).NotEmpty().WithMessage("**Requisition Type Name is required!");
        }
    }
}
