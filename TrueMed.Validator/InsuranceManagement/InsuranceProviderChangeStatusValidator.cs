using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.InsuranceManagement.Domains.Dtos;

namespace TrueMed.Validator.InsuranceManagement
{
    public class InsuranceProviderChangeStatusValidator : AbstractValidator<InsuranceProviderChangeStatusDto>
    {
        public InsuranceProviderChangeStatusValidator()
        {
            RuleFor(v => v.InsuranceProviderId).NotEmpty().WithMessage("**Insurance Provider ID is missing !");
            RuleFor(v => v.NewStatus).NotEmpty().WithMessage("**Status is missing !");
        }
    }
}
