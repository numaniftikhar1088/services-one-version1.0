using AutoMapper;
using TrueMed.CompendiumManagement.Domain.Models.Blood_Compendium.Request;
using TrueMed.Domain.Models.Database_Sets.Application;

namespace TrueMed.CompendiumManagement.Domain.Models.Blood_Compendium.Mapper_Profiles
{
    public class BloodCompendiumProfile : Profile
    {
        public BloodCompendiumProfile()
        {
            CreateMap<IndividualSetupViewModel, TblCompendiumTestConfiguration>()
                .ForMember(x => x.Unit, opt => opt.MapFrom(src => src.UOM))
                .ForMember(x => x.ResultType, opt => opt.MapFrom(src => src.ResultMethod))
                .ForMember(x => x.SpecimenTypeId, opt => opt.MapFrom(src => src.SpecimenType))
                .ForMember(x => x.InstrumentName, opt => opt.MapFrom(src => src.InstrumentName))
                .ForMember(x => x.InstrumentResultingMethod, opt => opt.MapFrom(src => src.InstrumentResultingMethod))
                .ForMember(x => x.CalcuationFormulaId, opt => opt.MapFrom(src => src.CalcuationFormula))
                .ReverseMap();

            CreateMap<IndividualSetupViewModel, UpdateIndividualSetupViewModel>().ReverseMap();
        }
    }
}
