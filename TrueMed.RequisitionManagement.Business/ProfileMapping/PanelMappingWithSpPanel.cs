using AutoMapper;
using TrueMed.RequisitionManagement.Domain.Models.Requisition.Response;

namespace TrueMed.RequisitionManagement.Business.ProfileMapping
{
    public class PanelMappingWithSpPanel : Profile
    {
        public PanelMappingWithSpPanel()
        {
            CreateMap<SpPanel, Panel>();
            //CreateMap<List<SpPanel>, List<Panel>>();
        }
    }
}
