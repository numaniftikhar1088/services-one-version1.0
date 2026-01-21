using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;

namespace TrueMed.CompendiumManagement.Business.Interface
{
    public interface ICompendiumDependencyReflexService
    {
        Task<RequestResponse> SaveAsync(SaveCompendiumDependencyReflexRequest request);
        Task<RequestResponse> DeleteAsync(int id);
        Task<DataQueryResponse<List<GetCompendiumDependencyReflexResponse>>> GetAsync(DataQueryModel<BloodCompendiumReflexTestQueryModel> query);
    }
}
