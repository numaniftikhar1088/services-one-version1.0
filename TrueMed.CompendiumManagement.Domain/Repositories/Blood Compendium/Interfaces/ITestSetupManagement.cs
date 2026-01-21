using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Blood_Compendium.Request;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Blood_Compendium.Interfaces
{
    public interface ITestSetupManagement
    {
        Task<bool> AddDepedencyTestAgainstTestById(int parentTestId, int childTestId);
        Task<bool> DeleteTestSetupByTestIdAsync(int testId);
        Task<bool> IsDepedencyTestExistsAgainstTestById(int testId);
        Task<bool> IsTestSetupExistsByTestIdAsync(int testId);
        Task<bool> SaveOrUpdateIndividualTypeSetupsAsync(IndividualSetupViewModel individualSetupViewModel);
        Task<bool> UpdateDepedencyTestAgainstTestById(int parentTestId, int childTestId);
    }
}
