using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;

namespace TrueMed.CompendiumManagement.Business.Interface
{
    public interface ISpecimenTypeService
    {
        Task<RequestResponse> SaveSpecimenTypeAsync(SaveSpecimenTypeRequest request);
        Task<DataQueryResponse<List<GetSpecimenTypeDetailResponse>>> GetSpecimenTypeDetailAsync(DataQueryModel<SpecimenTypeQueryModel> query);
        Task<RequestResponse> DeleteSpecimenTypeByIdAsync(int id);
        Task<RequestResponse> ChangeSpecimenTypeStatusAsync(ChangeSpecimenTypeStatusRequest request);
        Task<bool> IsSpecimenPreFixExistsAsync(string prefix);
        Task<RequestResponse<List<SpecimenTypeLookup>>> SpecimenTypeLookupAsync();
        Task<bool> IsSpecimenTypeExistsAsync(string specimenType);
    }
}
