using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;

namespace TrueMed.MasterPortalServices.BusinessLayer.Validation
{
    public class LabTestPanelAssignmentValidator : AbstractValidator<LabTestPanelAssignmentSaveRequest>
    {
        public LabTestPanelAssignmentValidator()
        {
            RuleFor(r => r.PanelId).NotEmpty().WithMessage("PanelId is required !").GreaterThan(0).WithMessage("PanelId must be greater then 0 !");
            RuleFor(r => r.TestId).NotEmpty().WithMessage("TestId is required !").GreaterThan(0).WithMessage("TestId must be greater then 0 !");
            RuleFor(r => r.LabId).NotEmpty().WithMessage("LabId is required !").GreaterThan(0).WithMessage("LabId must be greater then 0 !");
            RuleFor(r => r.ReqTypeId).NotEmpty().WithMessage("ReqTypeId is required !").GreaterThan(0).WithMessage("ReqTypeId must be greater then 0 !");
        }
    }
}
