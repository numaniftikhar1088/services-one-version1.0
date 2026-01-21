using FluentValidation;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;

namespace TrueMed.FacilityManagement.Business.Validations
{
    public class AddAssignRefLabAndGroupValidator : AbstractValidator<AddAssignRefLabAndGroupRequest>
    {
        public AddAssignRefLabAndGroupValidator()
        {
            RuleFor(v => v.RefLabId).NotEmpty().WithMessage("Reference Lab is required !");
            RuleFor(v => v.LabType).NotEmpty().WithMessage("LabType is required !");
            RuleFor(v => v.ReqTypeId).NotEmpty().WithMessage("Requisition Type is required !");
            RuleFor(v => v.GroupId).NotEmpty().WithMessage("Test Group is required !");
            RuleFor(v => v.FacilityId).NotEmpty().WithMessage("Facility Id is required !");
            RuleFor(v => v.InsuranceId).NotEmpty().WithMessage("Insurance Id is required !");
            RuleFor(v => v.InsuranceOptionId).NotEmpty().WithMessage("Insurance Option Id is required !");
        }
    }
    public class EditAssignRefLabAndGroupValidator : AbstractValidator<EditAssignRefLabAndGroupRequest>
    {
        public EditAssignRefLabAndGroupValidator()
        {
            RuleFor(v => v.Id).NotEmpty().WithMessage("Id is required !");
            RuleFor(v => v.RefLabId).NotEmpty().WithMessage("Reference Lab is required !");
            RuleFor(v => v.LabType).NotEmpty().WithMessage("LabType is required !");
            RuleFor(v => v.ReqTypeId).NotEmpty().WithMessage("Requisition Type is required !");
            RuleFor(v => v.GroupId).NotEmpty().WithMessage("Test Group is required !");
            RuleFor(v => v.FacilityId).NotEmpty().WithMessage("Facility Id is required !");
            RuleFor(v => v.InsuranceId).NotEmpty().WithMessage("Insurance Id is required !");
            RuleFor(v => v.InsuranceOptionId).NotEmpty().WithMessage("Insurance Option Id is required !");
        }
    }
}
