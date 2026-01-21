using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.PatientManagement.Domain.Models.Patient.Request;

namespace TrueMed.Validator.PatientManagement
{
    public class SavePatientLoginValidator : AbstractValidator<SavePatientLoginViewModel>
    {
        public SavePatientLoginValidator()
        {
            RuleFor(v => v.Email).NotEmpty().WithMessage("**Email is missing !");
            RuleFor(v => v.PatientId).NotEmpty().WithMessage("**Patient ID is missing !");
            RuleFor(v => v.Mobile).NotEmpty().WithMessage("**Mobile No is missing !");
            RuleFor(v => v.LoginPassword).NotEmpty().WithMessage("**Login Password is missing !");
            RuleFor(v => v.UserName).NotEmpty().WithMessage("**UserName is missing !");
        }
    }
}
