using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.InsuranceManagement.Domains.Dtos;

namespace TrueMed.Validator.InsuranceManagement
{
    public class SaveICD10CodeAssignmentValidator : AbstractValidator<SaveICD10CodeAssignmentDto>
    {
        public SaveICD10CodeAssignmentValidator()
        {
            RuleFor(v => v.Icd10id).NotEmpty().WithMessage("**ICD10Code is missing !");
            RuleFor(v => v.RefLabId).NotEmpty().WithMessage("**RefLabId is missing !");
            RuleFor(v => v.ReqTypeId).NotEmpty().WithMessage("**ReqTypeId is missing !");
            RuleFor(v => v.FacilityId).NotEmpty().WithMessage("**FacilityId is missing !");
        }
    }
}
