using FluentValidation;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;

namespace TrueMed.MasterPortalServices.BusinessLayer.Validation
{
    public class SaveMenuValidator : AbstractValidator<SaveMenuRequest>
    {
        public SaveMenuValidator()
        {
            RuleFor(v => v.Name).NotEmpty().WithMessage("**Menu Name is required!");
            RuleFor(v => v.ModuleId).NotEmpty().WithMessage("**Module Name is required!");
            RuleFor(v => v.LinkUrl).NotEmpty().WithMessage("**Menu Link is required!");
            RuleFor(v => v.IsVisible).NotEmpty().WithMessage("**IsVisible is required!");
            RuleFor(v => v.OrderId).NotEmpty().WithMessage("**Display Order is required!");
        }
    }
}
