using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;

namespace TrueMed.Validator.CompendiumManagement
{
    public class SpecimenTypeValidator : AbstractValidator<SaveSpecimenTypeRequest>
    {
        public SpecimenTypeValidator()
        {
            RuleFor(v => v.SpecimenType).NotEmpty().WithMessage("**SpecimenType is missing !");
        }
    }
    public class ChangeSpecimenTypeStatusValidator : AbstractValidator<ChangeSpecimenTypeStatusRequest>
    {
        public ChangeSpecimenTypeStatusValidator()
        {
            RuleFor(v => v.SpecimenTypeId).NotEmpty().WithMessage("**SpecimenTypeId is missing !");
            RuleFor(v => v.SpecimenStatus).NotEmpty().WithMessage("**SpecimenStatus is missing !");
        }
    }
}
