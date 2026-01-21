using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;

namespace TrueMed.RequisitionManagement.Business.Validations
{
    public class PendingRequisitionSaveValidator: AbstractValidator<WaitingForSignatureSaveRequest>
    {
        public PendingRequisitionSaveValidator()
        {
            RuleFor(r => r.PhysicianSignatureUrl).NotEmpty().WithMessage("Physician Signature is missing !");
            RuleFor(r => r.RequisitionIds).NotEmpty().WithMessage("RequisitionId is missing !");
            RuleFor(r => r.Status).NotEmpty().WithMessage("Status is missing !");
        }
    }
}
