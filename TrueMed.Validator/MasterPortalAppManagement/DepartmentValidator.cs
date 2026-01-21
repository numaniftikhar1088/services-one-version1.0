using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;

namespace TrueMed.Validator.MasterPortalAppManagement
{
    public class SaveDepartmentRequestValidator : AbstractValidator<SaveDepartmentRequest>
    {
        public SaveDepartmentRequestValidator()
        {
            RuleFor(v => v.DepartmentName).NotEmpty().NotNull().WithMessage("**DepartmentName is missing !");
        }
    }
    public class ChangeDepartmentStatusValidator : AbstractValidator<ChangeDepartmentStatusRequest>
    {
        public ChangeDepartmentStatusValidator()
        {
            RuleFor(v => v.DepId).NotEmpty().WithMessage("**DepId is missing !");
            RuleFor(v => v.DeptStatus).NotEmpty().WithMessage("**DeptStatus is missing !");
        }
    }
}
