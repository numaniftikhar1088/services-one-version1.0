using AutoMapper;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.MasterPortalServices.BusinessLayer.MappingProfile
{
    public class ReferenceLabProfile : Profile
    {
        public ReferenceLabProfile()
        {
            CreateMap<ReferenceLabRequest, TblLab>()
                 .ForMember(dest => dest.LabId, opt => opt.MapFrom(src => src.LabInformation.ReferenceLabId))
                   .ForMember(dest => dest.LaboratoryName, opt => opt.MapFrom(src => src.LabInformation.LabName))
                   .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.LabInformation.LabDisplayName))
                   .ForMember(dest => dest.Cliano, opt => opt.MapFrom(src => src.LabInformation.CLIA))
                   .ForMember(dest => dest.Enter3DigitsProgram, opt => opt.MapFrom(src => src.LabInformation.Enter3DigitsProgram))
                   .ForMember(dest => dest.Enter3DigitsLabCode, opt => opt.MapFrom(src => src.LabInformation.Enter3DigitsLabCode))
                   .ForMember(dest => dest.LabType, opt => opt.MapFrom(src => src.LabInformation.LabType))
                   .ForMember(dest => dest.IsEnableReferenceId, opt => opt.MapFrom(src => src.LabInformation.EnableReferenceId))
                   .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.LabInformation.Status))
                   .ForMember(dest => dest.PortalLogo, opt => opt.MapFrom(src => src.LabInformation.PortalLogo))
                   .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.LabInformation.LabAddress.Email))
                   .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.LabInformation.LabAddress.Phone))
                   .ForMember(dest => dest.FaxNumber, opt => opt.MapFrom(src => src.LabInformation.LabAddress.Fax))
                   .ForMember(dest => dest.Address1, opt => opt.MapFrom(src => src.LabInformation.LabAddress.Address__1))
                   .ForMember(dest => dest.Address2, opt => opt.MapFrom(src => src.LabInformation.LabAddress.Address__2))
                   .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.LabInformation.LabAddress.City1))
                   .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.LabInformation.LabAddress.State1))
                   .ForMember(dest => dest.ZipCode, opt => opt.MapFrom(src => src.LabInformation.LabAddress.ZipCode1));


            CreateMap<ReferenceLabRequest, TblDirectorInformation>()
                 .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.LabDirectorId))
                  .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.FirstName))
                  .ForMember(dest => dest.MiddleName, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.MiddleName))
                  .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.LastName))
                  .ForMember(dest => dest.EmailAddress, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.EmailAddress))
                  .ForMember(dest => dest.Mobile, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.Mobile))
                  .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.Phone))
                  .ForMember(dest => dest.Address1, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.Address__1))
                  .ForMember(dest => dest.Address2, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.Address__2))
                  .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.City1))
                  .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.State1))
                  .ForMember(dest => dest.ZipCode, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.ZipCode1))
                  .ForMember(dest => dest.CapInfoNumber, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.CapInfoNumber))
                  .ForMember(dest => dest.NoCapProvider, opt => opt.MapFrom(src => src.LabInformation.LabDirectorInfo.NoCapProvider));
        }
    }
}
