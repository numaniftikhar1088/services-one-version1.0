using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;

namespace TrueMed.Validator.MasterPortalAppManagement
{
    public class SaveTestSetupRequestValidator : AbstractValidator<SaveTestSetupRequest>
    {
        public SaveTestSetupRequestValidator()
        {
            RuleFor(v => v.TestName).NotEmpty().NotNull().WithMessage("**TestName is missing !");
        }
    }
    public class ChangeTestSetupStatusValidator : AbstractValidator<ChangeTestSetupStatusRequest>
    {
        public ChangeTestSetupStatusValidator()
        {
            RuleFor(v => v.Id).NotEmpty().WithMessage("**TestId is missing !");
            RuleFor(v => v.IsActive).NotEmpty().WithMessage("**TestStatus is missing !");
        }
    }
}
