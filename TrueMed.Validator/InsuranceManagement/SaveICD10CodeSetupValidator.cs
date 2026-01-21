using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.InsuranceManagement.Domains.Dtos;

namespace TrueMed.Validator.InsuranceManagement
{
    public class SaveICD10CodeSetupValidator : AbstractValidator<SaveICD10CodeSetupDto>
    {
        public SaveICD10CodeSetupValidator()
        {
            RuleFor(v => v.Icd10code).NotEmpty().WithMessage("**ICD10Code is missing !");
            RuleFor(v => v.Description).NotEmpty().WithMessage("**ICD10Code Description is missing !");
            RuleFor(v => v.Icd10status).NotEmpty().WithMessage("**ICD10Code Status is missing !");
        }
    }
}
