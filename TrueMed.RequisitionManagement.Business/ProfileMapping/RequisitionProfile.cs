using AutoMapper;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Internal;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;

namespace TrueMed.RequisitionManagement.Business.ProfileMapping
{
    public class RequisitionProfile
    {
        public class tblReqMasterProfile : Profile
        {
            public tblReqMasterProfile()
            {
                CreateMap<SaveRequisitionInternal, TrueMed.Domain.Models.Database_Sets.Application.TblRequisitionMaster>()
                     .ForMember(dest => dest.FacilityId, opt => opt.MapFrom(src => src.CommonReq.Facility.FacilityId))
                     .ForMember(dest => dest.PhysicianId, opt => opt.MapFrom(src => src.CommonReq.Facility.PhysicianId))
                     .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.CommonReq.PatientSection.FirstName))
                     .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.CommonReq.PatientSection.LastName))
                     .ForMember(dest => dest.Dob, opt => opt.MapFrom(src => src.CommonReq.PatientSection.Dob))
                     .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.CommonReq.PatientSection.Gender))
                     .ForMember(dest => dest.Address1, opt => opt.MapFrom(src => src.CommonReq.PatientSection.Address1))
                     .ForMember(dest => dest.Address2, opt => opt.MapFrom(src => src.CommonReq.PatientSection.Address2))
                     .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.CommonReq.PatientSection.City))
                     .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.CommonReq.PatientSection.State))
                     .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.CommonReq.PatientSection.Country))
                     .ForMember(dest => dest.ZipCode, opt => opt.MapFrom(src => src.CommonReq.PatientSection.ZipCode))
                     .ForMember(dest => dest.County, opt => opt.MapFrom(src => src.CommonReq.PatientSection.County))
                     .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.CommonReq.PatientSection.Phone))
                     .ForMember(dest => dest.Mobile, opt => opt.MapFrom(src => src.CommonReq.PatientSection.Mobile))
                     .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.CommonReq.PatientSection.Email))
                     .ForMember(dest => dest.Race, opt => opt.MapFrom(src => src.CommonReq.PatientSection.Race))
                     .ForMember(dest => dest.Ethnicity, opt => opt.MapFrom(src => src.CommonReq.PatientSection.Ethnicity))
                     .ForMember(dest => dest.SocialSecurityNumber, opt => opt.MapFrom(src => src.CommonReq.PatientSection.SocialSecurity))
                     //.ForMember(dest => dest.PatientDlId, opt => opt.MapFrom(src => src.CommonReq.PatientSection.PatientDlId))
                     .ForMember(dest => dest.PassPortNumber, opt => opt.MapFrom(src => src.CommonReq.PatientSection.PassPort))
                     .ForMember(dest => dest.PatientType, opt => opt.MapFrom(src => src.CommonReq.PatientSection.PatientType))
                     .ForMember(dest => dest.Height, opt => opt.MapFrom(src => src.CommonReq.PatientSection.Height))
                     .ForMember(dest => dest.Weight, opt => opt.MapFrom(src => src.CommonReq.PatientSection.Weight))
                     .ForMember(dest => dest.OrderType, opt => opt.MapFrom(src => src.CommonReq.OrderInformation.OrderType))
                     .ForMember(dest => dest.DateofCollection, opt => opt.MapFrom(src => src.CommonReq.OrderInformation.DateofCollection))
                     .ForMember(dest => dest.TimeofCollection, opt => opt.MapFrom(src => src.CommonReq.OrderInformation.TimeofCollection))
                     .ForMember(dest => dest.DateReceived, opt => opt.MapFrom(src => src.CommonReq.OrderInformation.DateReceived))
                     .ForMember(dest => dest.Mileage, opt => opt.MapFrom(src => src.CommonReq.OrderInformation.Mileage))
                     .ForMember(dest => dest.CollectorId, opt => opt.MapFrom(src => src.CommonReq.OrderInformation.CollectorId))
                     .ForMember(dest => dest.CollectedBy, opt => opt.MapFrom(src => src.CommonReq.OrderInformation.CollectedBy))
                     .ForMember(dest => dest.StatOrder, opt => opt.MapFrom(src => src.CommonReq.OrderInformation.StatOrder))
                     .ForMember(dest => dest.PhysicianSignature, opt => opt.MapFrom(src => src.CommonReq.PhysicianSignature.PhysicianSignatureUrlpath))
                     .ForMember(dest => dest.PatientSignature, opt => opt.MapFrom(src => src.CommonReq.PatientSignature.PatientSignatureUrlpath));
            } 
        }
        public class PatientBasicInfoProfile : Profile
        {
            public PatientBasicInfoProfile()
            {
                CreateMap<PatientSection, TrueMed.Domain.Models.Database_Sets.Application.TblPatientBasicInfo>()
                 .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                 .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                 .ForMember(dest => dest.Dob, opt => opt.MapFrom(src => Convert.ToDateTime(src.Dob).Date))
                 .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
                 .ForMember(dest => dest.SocialSecurityNumber, opt => opt.MapFrom(src => src.SocialSecurity))
                 .ForMember(dest => dest.Race, opt => opt.MapFrom(src => src.Race))
                 .ForMember(dest => dest.Ethnicity, opt => opt.MapFrom(src => src.Ethnicity))
                 .ForMember(dest => dest.PassPortNumber, opt => opt.MapFrom(src => src.PassPort))
                 //.ForMember(dest => dest.Dlidnumber, opt => opt.MapFrom(src => src.PatientDlId))
                 .ForMember(dest => dest.PatientType, opt => opt.MapFrom(src => src.PatientType))
                 .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));
            }
        }
        public class TblPatientAddInfoProfile : Profile
        {
            public TblPatientAddInfoProfile()
            {
                CreateMap<PatientSection, TrueMed.Domain.Models.Database_Sets.Application.TblPatientAddInfo>()
                     .ForMember(dest => dest.Address1, opt => opt.MapFrom(src => src.Address1))
                     .ForMember(dest => dest.Address2, opt => opt.MapFrom(src => src.Address2))
                     .ForMember(dest => dest.ZipCode, opt => opt.MapFrom(src => src.ZipCode))
                     .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
                     .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State))
                     .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Country))
                     .ForMember(dest => dest.County, opt => opt.MapFrom(src => src.County))
                     //.ForMember(dest => dest.LandPhone, opt => opt.MapFrom(src => src.Phone))
                     .ForMember(dest => dest.Mobile, opt => opt.MapFrom(src => src.Mobile))
                     .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                     .ForMember(dest => dest.Weight, opt => opt.MapFrom(src => src.Weight))
                     .ForMember(dest => dest.Height, opt => opt.MapFrom(src => src.Height));
            }
        }
        public class TblRequisitionPatientInsuranceProfile : Profile
        {
            public TblRequisitionPatientInsuranceProfile()
            {
                CreateMap<BillingInfoSection, TrueMed.Domain.Models.Database_Sets.Application.TblRequisitionPatientInsurance>()
                     .ForMember(dest => dest.BillingType, opt => opt.MapFrom(src => src.InsuranceType))
                     .ForMember(dest => dest.RelationshipToInsured, opt => opt.MapFrom(src => src.Relation))
                     .ForMember(dest => dest.InsuranceProviderId, opt => opt.MapFrom(src => src.InsuranceProviderId))
                     .ForMember(dest => dest.PrimaryGroupId, opt => opt.MapFrom(src => src.GroupNumber))
                     .ForMember(dest => dest.PrimaryPolicyId, opt => opt.MapFrom(src => src.PolicyId))
                     .ForMember(dest => dest.InsurancePhone, opt => opt.MapFrom(src => src.InsurancePhoneNumbr))
                     .ForMember(dest => dest.SubscriberName, opt => opt.MapFrom(src => src.SubscriberName))
                     .ForMember(dest => dest.SubscriberDob, opt => opt.MapFrom(src => src.SubscriberDob))
                    .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));
            }
        }
        public class MedicalNecessityProfile : Profile
        {
            public MedicalNecessityProfile()
            {
                CreateMap<MedicalNecessitySection, TrueMed.Domain.Models.Database_Sets.Application.TblRequisitionMedicalNecessity>();
            }
        }
        public class AddNewProviderProfile : Profile
        {
            public AddNewProviderProfile()
            {
                CreateMap<RequisitionRequest.AddNewProvider, TrueMed.Sevices.MasterEntities.TblUser>()
                   .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
                    .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                    .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                    .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
                    .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                    .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false))
                    .ForMember(dest => dest.CreateDate, opt => opt.MapFrom(src => DateTimeNow.Get))
                    .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

            }
        }


    }
}
