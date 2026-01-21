using FluentValidation;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request; 


namespace TrueMed.Validator.CompendiumManagement
{
    public class SaveTestTypeValidator : AbstractValidator<SaveTestTypeRequest> 
    {
        public SaveTestTypeValidator()
        {
            RuleFor(v => v.TestType).NotEmpty().WithMessage("**TestType is missing !");
        }
    }
    public class ChangeTestTypeStatusValidator : AbstractValidator<ChangeTestTypeStatusRequest>
    {
        public ChangeTestTypeStatusValidator()
        {
            RuleFor(v => v.TestTypeId).NotEmpty().WithMessage("**TestTypeId is missing !");
            RuleFor(v => v.TestTypeStatus).NotEmpty().WithMessage("**TestTypeStatus is missing !");
        }
    }
}
