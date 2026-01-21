using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;

namespace TrueMed.Validator.CompendiumManagement
{
    public class SpecimenTypeAssignmentValidator : AbstractValidator<SpecimenTypeAssignmentRequest>
    {
        public SpecimenTypeAssignmentValidator()
        {
            //RuleFor(v => v.PanelId).NotEmpty().WithMessage("**PanelId is missing !");
            //RuleFor(v => v.TestId).NotEmpty().WithMessage("**TestId is missing !");
            //RuleFor(v => v.RefLabId).NotEmpty().WithMessage("**RefLabId is missing !");
            RuleFor(v => v.ReqTypeId).NotEmpty().WithMessage("**ReqTypeId is missing !");
            RuleFor(v => v.SpecimenTypeId).NotEmpty().WithMessage("**SpecimenTypeId is missing !");
        }
    }
    public class ChangeSpecimenTypeAssignmentStatusValidator : AbstractValidator<ChangeSpecimenTypeAssignmentStatusRequest>
    {
        public ChangeSpecimenTypeAssignmentStatusValidator()
        {
            RuleFor(v => v.Id).NotEmpty().WithMessage("**Id is missing !");
            //RuleFor(v => v.Isactive).NotEmpty().WithMessage("**Status is missing !");
        }
    }
}
