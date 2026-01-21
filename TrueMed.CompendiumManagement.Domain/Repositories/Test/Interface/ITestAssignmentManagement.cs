using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface
{
    public interface ITestAssignmentManagement
    {
        Task<bool> AssignmentActivationByIdAsync(int id, bool isActive);
        Task<bool> DeleteAssignmentByIdAsync(int id);
        IQueryable<TestAssignmentModel> GetAllTestAssignments();
        Task<bool> IsTestAssignmentExistsByIdAsync(int id);
        Task<bool> SaveOrUpdateTestAssignmentByIdAsync(TestAssignmentViewModel testAssignmentViewModel);
    }
}
