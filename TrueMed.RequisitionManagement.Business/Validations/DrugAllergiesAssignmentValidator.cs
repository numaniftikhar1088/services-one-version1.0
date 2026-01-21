using FluentValidation;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;

namespace TrueMed.RequisitionManagement.Business.Validations
{
    public class DrugAllergiesAssignmentValidator
    {
        public class SaveRequestValidation : AbstractValidator<DrugAllergiesAssignmentRequest.SaveRequest>
        {
            public SaveRequestValidation()
            {
                RuleFor(r => r.Code).NotEmpty().WithMessage("{PropertyName} is required !");
                RuleFor(r => r.DrugName).NotEmpty().WithMessage("{PropertyName} is required !");
                RuleFor(r => r.Status).NotEmpty().WithMessage("{PropertyName} is required !");
                //RuleFor(r => r.RefLabId).NotEmpty().NotEqual(0).WithMessage("{PropertyName} is required !");
                RuleFor(r => r.ReqTypeId).NotEmpty().NotEqual(0).WithMessage("{PropertyName} is required !");
                //RuleFor(r => r.FacilityId).NotEmpty().NotEqual(0).WithMessage("{PropertyName} is required !");
                //RuleFor(r => r.PanelId).NotEmpty().NotEqual(0).WithMessage("{PropertyName} is required !");
            }
        }
        public class StatusChangedRequestValidation : AbstractValidator<DrugAllergiesAssignmentRequest.StatusChangedRequest>
        {
            public StatusChangedRequestValidation()
            {
                RuleFor(r => r.Id).NotEmpty().NotEqual(0).WithMessage("{PropertyName} is required !");
                RuleFor(r => r.Status).NotEmpty().WithMessage("{PropertyName} is required !");
            }
        }
    }
}
