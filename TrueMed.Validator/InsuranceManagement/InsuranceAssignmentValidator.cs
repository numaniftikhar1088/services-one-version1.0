using FluentValidation;
using TrueMed.InsuranceManagement.Domain.Dtos;

namespace TrueMed.Validator.InsuranceManagement
{
    public class InsuranceAssignmentValidator : AbstractValidator<SaveInsuranceAssignmentDto>
    {
        public InsuranceAssignmentValidator()
        {
            RuleFor(IA => IA.ProviderId).NotEmpty().WithMessage("**Provider ID is missing !");
            RuleFor(IA => IA.ProviderDisplayName).NotEmpty().WithMessage("**Provider Display Name is missing !");
            RuleFor(IA => IA.ProviderCode).NotEmpty().WithMessage("**Provider Code is missing !");
            RuleFor(IA => IA.InsuranceId).NotEmpty().WithMessage("**Insurance ID is missing !");
            RuleFor(IA => IA.InsuranceType).NotEmpty().WithMessage("**Insurance Type is missing !");
            RuleFor(IA => IA.Status).NotEmpty().WithMessage("**Status is missing !");
            RuleFor(IA => IA.ProviderId).NotEmpty().WithMessage("**Provider ID is missing !");
        }
    }
}
