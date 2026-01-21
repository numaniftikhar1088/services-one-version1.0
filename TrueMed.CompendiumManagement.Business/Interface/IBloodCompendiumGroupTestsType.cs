using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;

namespace TrueMed.CompendiumManagement.Business.Interface
{
    public interface IBloodCompendiumGroupTestsType
    {
        Task<RequestResponse> SaveAsync(SaveGroupTestsTypeRequest request);
        Task<RequestResponse> GetAllAsync();
    }
}
