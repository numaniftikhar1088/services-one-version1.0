using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.InsuranceManagement.Domains.Dtos;

namespace TrueMed.Validator.InsuranceManagement
{
    public class SaveInsuranceProviderValidator : AbstractValidator<SaveInsuranceProviderDto>
    {
        public SaveInsuranceProviderValidator()
        {
            RuleFor(v => v.ProviderName).NotEmpty().WithMessage("**Provider Name is missing !");
            RuleFor(v => v.Address1).NotEmpty().WithMessage("**Address is missing !");
            RuleFor(v => v.City).NotEmpty().WithMessage("**City is missing !");
            RuleFor(v => v.State).NotEmpty().WithMessage("**State is missing !");
            RuleFor(v => v.ZipCode).NotEmpty().WithMessage("**ZipCode is missing !");
            RuleFor(v => v.LandPhone).NotEmpty().WithMessage("**Phone is missing !");
            //RuleFor(v => v.ProviderCode).NotEmpty().WithMessage("**Provider Code is missing !");
            RuleFor(v => v.ProviderStatus).NotEmpty().WithMessage("**Provider Status is missing !");
        }
    }
}
