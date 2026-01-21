using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.InsuranceManagement.Domains.Dtos;

namespace TrueMed.Validator.InsuranceManagement
{
    public class OrderInsuranceSaveValidator : AbstractValidator<OrderInsuranceSaveDto>
    {
        public OrderInsuranceSaveValidator()
        {
            RuleFor(v => v.RequisitionId).NotEmpty().WithMessage("**RequisitionId is missing !");
            RuleFor(v => v.InsuranceId).NotEmpty().WithMessage("**InsuranceId is missing !");
            RuleFor(v => v.AccidentDate).NotEmpty().WithMessage("**AccidentDate is missing !");
            RuleFor(v => v.AccidentType).NotEmpty().WithMessage("**AccidentType is missing !");
            RuleFor(v => v.AccidentState).NotEmpty().WithMessage("**AccidentState is missing !");
            RuleFor(v => v.InsuranceProviderId).NotEmpty().WithMessage("**InsuranceProviderId is missing !");
            RuleFor(v => v.InsuranceType).NotEmpty().WithMessage("**SDOB is missing !");
            RuleFor(v => v.Relation).NotEmpty().WithMessage("**SRelation is missing !");
            RuleFor(v => v.GroupNumber).NotEmpty().WithMessage("**GroupNumber is missing !");
            RuleFor(v => v.PolicyId).NotEmpty().WithMessage("**PolicyId is missing !");
            RuleFor(v => v.InsurancePhoneNumbr).NotEmpty().WithMessage("**InsurancePhoneNumbr is missing !");
        }
    }
}
