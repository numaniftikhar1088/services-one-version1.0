using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;

namespace TrueMed.Validator.CompendiumManagement
{
    public class SavePanelSetupRequestValidator : AbstractValidator<SavePanelSetupRequest>
    {
        public SavePanelSetupRequestValidator()
        {
            RuleFor(v => v.PanelName).NotEmpty().NotNull().WithMessage("**PanelName is missing !");
        }
    }
    public class ChangePanelSetupStatusValidator : AbstractValidator<ChangePanelSetupStatusRequest>
    {
        public ChangePanelSetupStatusValidator()
        {
            RuleFor(v => v.Id).NotEmpty().WithMessage("**Id is missing !");
            RuleFor(v => v.IsActive).NotEmpty().WithMessage("**Status is missing !");
        }
    }
}
