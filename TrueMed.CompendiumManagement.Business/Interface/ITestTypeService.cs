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
    public interface ITestTypeService
    {
        Task<RequestResponse> SaveTestTypeAsync(SaveTestTypeRequest request);
        Task<RequestResponse> ChangeTestTypeStatusAsync(ChangeTestTypeStatusRequest request);
        Task<RequestResponse> DeleteTestTypeByIdAsync(int id);
        Task<DataQueryResponse<List<TestTypeResponse>>> GetTestTypeDetailAsync(DataQueryModel<TestTypeQueryModel> query); 

        #region Lookups
        Task<List<TestTypeLookup>> TestTypeLookupAsync();
        #endregion
    }
}
