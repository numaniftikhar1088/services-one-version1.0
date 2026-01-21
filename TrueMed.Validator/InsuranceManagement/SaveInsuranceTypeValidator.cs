using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.InsuranceManagement.Domains.Dtos;

namespace TrueMed.Validator.InsuranceManagement
{
    public class SaveInsuranceTypeValidator : AbstractValidator<SaveInsuranceSetupDto>
    {
        public SaveInsuranceTypeValidator()
        {
            RuleFor(v => v.InsuranceType).NotEmpty().WithMessage("**Insurance Type is missing !");
            RuleFor(v => v.InsuranceName).NotEmpty().WithMessage("**Insurance Name is missing !");
            RuleFor(v => v.InsuranceStatus).NotEmpty().WithMessage("**Insurance Status is missing !");
        }
    }
}
