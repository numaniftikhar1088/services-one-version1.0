using FluentValidation;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;

namespace TrueMed.RequisitionManagement.Business.Validations
{
    public class RequisitionValidator
    {
        public class AddNewProviderValidation : AbstractValidator<RequisitionRequest.AddNewProvider>
        {
            public AddNewProviderValidation()
            {
                RuleFor(r => r.NPI).NotEmpty().WithMessage("{PropertyName} is missing !");
                RuleFor(r => r.FirstName).NotEmpty().WithMessage("{PropertyName} is missing !");
                RuleFor(r => r.LastName).NotEmpty().WithMessage("{PropertyName} is missing !");
                RuleFor(r => r.Gender).NotEmpty().WithMessage("{PropertyName} is missing !");
                RuleFor(r => r.Email).NotEmpty().WithMessage("{PropertyName} is missing !");
            }
        }
    }
}
