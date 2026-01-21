using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;

namespace TrueMed.CompendiumManagement.Business.Interface
{
    public interface ITestLookupsService
    {
        Task<RequestResponse<List<DependencyAndReflexTest>>> DependencyAndReflexTestLookupAsync(int performinglabID);
    }
}
