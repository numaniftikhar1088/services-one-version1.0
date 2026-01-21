using FluentValidation;
using TrueMed.InsuranceManagement.Domains.Dtos;

namespace TrueMed.Validator.InsuranceManagement
{
    public class ChangeInsuranceSetupStatusValidator : AbstractValidator<ChangeInsuranceSetupStatusDto>
    {
        public ChangeInsuranceSetupStatusValidator()
        {
            RuleFor(r => r.InsuranceId).NotEmpty().WithMessage("**Insurance ID is missing !");
            RuleFor(r => r.NewStatus).NotEmpty().WithMessage("**Status is empty !");
        }
    }
}
