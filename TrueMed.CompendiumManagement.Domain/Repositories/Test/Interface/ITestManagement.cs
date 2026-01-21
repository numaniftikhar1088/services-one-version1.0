
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface
{
    public interface ITestManagement
    {
        IQueryable<TestModel> GetAllTests();
        Task<bool> IsTestExistsByIdAsync(int id);
        Task<bool> IsTestExistsByNameAsync(string name);
        Task<bool> SaveOrUpdateTestAsync(TestViewModel testViewModel);
        Task<bool> DeleteTestByIdAsync(int id);
        Task<bool> TestActiviationByIdAsync(int id, bool isActive);
        Task<bool> IsTestNameValidAsync(KeyValuePairViewModel<int?> uniqueKeyValidation);
        Task<int?> GetTestIdByNameAsync(string name);
        Task<string?> GenerateTimitCodeByTestIdAsync(int id);
        Task<bool> UpdateTestTmitCodeByIdAsync(int id, string timitCode);
        Task<bool> IsTmitCodeValidAsync(string timitCode);
    }
}
