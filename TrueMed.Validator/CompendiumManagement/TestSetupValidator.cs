using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;

namespace TrueMed.Validator.CompendiumManagement
{
    public class SaveTestSetupValidator : AbstractValidator<SaveTestSetupRequest>
    {
        public SaveTestSetupValidator()
        {
            RuleFor(v => v.TestName).NotEmpty().WithMessage("**TestName is missing !");
        }
    }
    public class ChangeTestSetupStatusValidator : AbstractValidator<ChangeTestSetupStatusRequest>
    {
        public ChangeTestSetupStatusValidator()
        {
            RuleFor(v => v.TestId).NotEmpty().WithMessage("**TestId is missing !");
            RuleFor(v => v.TestStatus).NotEmpty().WithMessage("**TestStatus is missing !");
        }
    }
}
