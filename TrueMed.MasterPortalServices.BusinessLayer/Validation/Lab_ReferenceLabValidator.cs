using FluentValidation;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;

namespace TrueMed.MasterPortalServices.BusinessLayer.Validation
{
    public class Lab_ReferenceLabValidator : AbstractValidator<ReferenceLabRequest>
    {
        public Lab_ReferenceLabValidator()
        {
            #region Lab Imformation Section
            RuleFor(v => v.LabInformation.LabName).NotEmpty().WithMessage("LabName is required !");
            RuleFor(v => v.LabInformation.LabDisplayName).NotEmpty().WithMessage("LabDisplayName is required !");
            RuleFor(v => v.LabInformation.CLIA).NotEmpty().WithMessage("CLIA is required !");
            RuleFor(v => v.LabInformation.Enter3DigitsProgram).NotEmpty().WithMessage("Enter3DigitsProgram is required !");
            RuleFor(v => v.LabInformation.Enter3DigitsLabCode).NotEmpty().WithMessage("Enter3DigitsLabCode is required !");
            RuleFor(v => v.LabInformation.LabType).NotEmpty().WithMessage("LabType is required !");
            RuleFor(v => v.LabInformation.EnableReferenceId).NotEmpty().WithMessage("EnableReferenceId is required !");
            RuleFor(v => v.LabInformation.Status).NotEmpty().WithMessage("Status is required !");
            #endregion
            #region Lab Address Section
            RuleFor(v => v.LabInformation.LabAddress.Phone).NotEmpty().WithMessage("Phone is required !");
            RuleFor(v => v.LabInformation.LabAddress.Address__1).NotEmpty().WithMessage("Address_1 is required !");
            #endregion
            #region Lab Director Info
            RuleFor(v => v.LabInformation.LabDirectorInfo.FirstName).NotEmpty().WithMessage("FirstName is required !");
            RuleFor(v => v.LabInformation.LabDirectorInfo.LastName).NotEmpty().WithMessage("LastName is required !");
            RuleFor(v => v.LabInformation.LabDirectorInfo.Mobile).NotEmpty().WithMessage("Mobile is required !");
            RuleFor(v => v.LabInformation.LabDirectorInfo.Address__1).NotEmpty().WithMessage("Address_1 is required !");
            RuleFor(v => v.LabInformation.LabDirectorInfo.CapInfoNumber).NotEmpty().WithMessage("CapInfoNumber is required !");
            RuleFor(v => v.LabInformation.LabDirectorInfo.NoCapProvider).NotEmpty().WithMessage("NoCapProvider is required !");
            #endregion
        }
    }
}
