using FluentValidation;
using TrueMed.InsuranceManagement.Domain.Dtos;

namespace TrueMed.Validator.InsuranceManagement
{
    public class ChangeInsuranceAssignmentStatusValidator : AbstractValidator<ChangeInsuranceAssignmentStatusDto>
    {
        public ChangeInsuranceAssignmentStatusValidator()
        {
            RuleFor(IASC => IASC.InsuranceAssignmentId).NotEmpty().WithMessage("**Insurance Assignment Id is missing !");
            RuleFor(IASC => IASC.NewStatus).NotEmpty().WithMessage("**Status is empty !");
        }
    }
}

