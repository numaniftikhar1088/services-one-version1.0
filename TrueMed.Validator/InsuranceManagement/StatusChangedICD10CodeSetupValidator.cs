using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.InsuranceManagement.Domains.Dtos;

namespace TrueMed.Validator.InsuranceManagement
{
    public class StatusChangedICD10CodeSetupValidator : AbstractValidator<StatusChangedICD10CodeSetupDto>
    {
        public StatusChangedICD10CodeSetupValidator()
        {
            RuleFor(v => v.ICD10CodeID).NotEmpty().WithMessage("**ICD10CodeID is missing !");
            RuleFor(v => v.NewStatus).NotEmpty().WithMessage("**Status is missing !");
        }
    }
}
