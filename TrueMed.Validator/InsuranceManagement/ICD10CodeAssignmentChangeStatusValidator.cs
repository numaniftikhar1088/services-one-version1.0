using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.InsuranceManagement.Domain.Dtos;

namespace TrueMed.Validator.InsuranceManagement
{
    public class ICD10CodeAssignmentChangeStatusValidator : AbstractValidator<ChangeICD10CodeAssignmentStatusDto>
    {
        public ICD10CodeAssignmentChangeStatusValidator()
        {
            RuleFor(v => v.ICD10CodeAssignmentId).NotEmpty().WithMessage("ICD10CodeAssignmentId is missing !");
            RuleFor(v => v.NewStatus).NotEmpty().WithMessage("Status in missing !");
        }
    }
}
