using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;

namespace TrueMed.Validator.CompendiumManagement
{
    public class IDCompendiumAssayDataValidator : AbstractValidator<SaveIDCompendiumAssayDataRequest>
    {
        public IDCompendiumAssayDataValidator()
        {
            RuleFor(v => v.TestName).NotEmpty().WithMessage("**Test Name is missing !");
            RuleFor(v => v.TestCode).NotEmpty().WithMessage("**Test Code is missing !");
            RuleFor(v => v.ReferenceLabId).NotEmpty().WithMessage("**Performing Lab Id is missing !");
        }
    }
}
