using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;

namespace TrueMed.FacilityManagement.Business.Validations
{
    public class LabAssignmentValidator : AbstractValidator<AddLabAssignmentRequest>
    {
        public LabAssignmentValidator()
        {
            RuleFor(v => v.ProfileName).NotEmpty().WithMessage("Profile Name is required !");
            RuleFor(v => v.RefLabId).NotEmpty().WithMessage("Reference Lab Id is required !"); 
            RuleFor(v => v.ReqTypeId).NotEmpty().WithMessage("ReqType Id is required !");
            RuleFor(v => v.GroupIds).NotEmpty().WithMessage("Group Id is required !");
        }
    }
    public class FacilitiesValidator : AbstractValidator<SaveFacilities>
    {
        public FacilitiesValidator()
        {
            RuleFor(v => v.Id).NotEmpty().WithMessage("Id is required !");
        }
    }
}
