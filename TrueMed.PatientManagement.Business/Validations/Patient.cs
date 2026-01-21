using FluentValidation;
using TrueMed.PatientManagement.Domain.Models.Dtos.Request;

namespace TrueMed.PatientManagement.Business.Validations
{
    public class PatientValidatorOnSave : AbstractValidator<SavePatientRequest>
    {
        public PatientValidatorOnSave()
        {
            #region Patient Information
            RuleFor(v => v.PatientInformation.FirstName).NotEmpty().WithMessage("PatientInformation.FirstName is required !");
            RuleFor(v => v.PatientInformation.LastName).NotEmpty().WithMessage("PatientInformation.FirstName is required !");
            RuleFor(v => v.PatientInformation.DateOfBirth).NotEmpty().WithMessage("PatientInformation.DateOfBirth is required !");
            RuleFor(v => v.PatientInformation.Gender).NotEmpty().WithMessage("PatientInformation.Gender is required !");
            RuleFor(v => v.PatientInformation.PatientType).NotEmpty().WithMessage("PatientInformation.PatientType is required !");
            #endregion
            #region Patient Current Address
            RuleFor(v => v.PatientInformation.Address.Address1).NotEmpty().WithMessage("AddressInformation.Address1 is required !");
            RuleFor(v => v.PatientInformation.Address.ZipCode).NotEmpty().WithMessage("AddressInformation.ZipCode is required !");
            RuleFor(v => v.PatientInformation.Address.City).NotEmpty().WithMessage("AddressInformation.City is required !");
            RuleFor(v => v.PatientInformation.Address.State).NotEmpty().WithMessage("AddressInformation.State is required !");
            //RuleFor(v => v.PatientInformation.Address.Country).NotEmpty().WithMessage("AddressInformation.Country is required !");
            RuleFor(v => v.PatientInformation.Address.MobileNumber).NotEmpty().WithMessage("AddressInformation.MobileNumber is required !");
            RuleFor(v => v.PatientInformation.Address.Email).NotEmpty().WithMessage("AddressInformation.Email is required !");
            //RuleFor(v => v.PatientInformation.Address.Weight).NotEmpty().WithMessage("AddressInformation.Weight is required !");
            //RuleFor(v => v.PatientInformation.Address.Height).NotEmpty().WithMessage("AddressInformation.Height is required !");
            #endregion
        }
    }
}
