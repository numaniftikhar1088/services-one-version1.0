using FluentValidation;
using TrueMed.UserManagement.Domain.Models.Dtos.Request;

namespace TrueMed.UserManagement.Business.Validations
{
    public class FacilityUserCreateValidator : AbstractValidator<FacilityUserCreateRequest>
    {
        public FacilityUserCreateValidator()
        {
            RuleFor(v => v.FirstName).NotEmpty().WithMessage("**FirstName is required...");
            RuleFor(v => v.LastName).NotEmpty().WithMessage("**LastName is required...");
            RuleFor(v => v.NPI).NotEmpty().When(v => v.AdminTypeId == 8).WithMessage("**NPI is required...");
            RuleFor(v => v.StateLicense).NotEmpty().When(v => v.AdminTypeId == 8).WithMessage("**StateLicense is required...");
            RuleFor(v => v.Gender).NotEmpty().WithMessage("**Gender is required...");
            RuleFor(v => v.UserTitle).NotEmpty().WithMessage("**UserTitle is required...");
        }
    }
}
