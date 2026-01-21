using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Test.Implementation
{
    public class TestAssignmentManagement : ITestAssignmentManagement
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext? _applicationDbContext;

        public TestAssignmentManagement(
            IConnectionManager connectionManager, 
            ApplicationDbContext applicationDbContext)
        {
            this._connectionManager = connectionManager;
            _applicationDbContext = applicationDbContext;
        }

        public async Task<bool> SaveOrUpdateTestAssignmentByIdAsync(TestAssignmentViewModel testAssignmentViewModel)
        {
            var isUpdating = testAssignmentViewModel is UpdateTestAssignmentViewModel;

            if (isUpdating)
            {
                if (!await IsTestAssignmentExistsByIdAsync((int)testAssignmentViewModel.Id))
                {
                    return false;
                }
            }

            var testAssign = await _applicationDbContext.TblCompendiumPanelTestAssignments.FirstOrDefaultAsync(x => x.Id == testAssignmentViewModel.Id);
            if (testAssign == null)
            {
                testAssign = new TrueMed.Domain.Models.Database_Sets.Application.TblCompendiumPanelTestAssignment();
                testAssign.CreatedBy = _connectionManager.UserId;
                testAssign.CreatedDate = DateTimeNow.Get;
            }
            else
            {
                testAssign.UpdatedBy = _connectionManager.UserId;
                testAssign.UpdatedDate = DateTimeNow.Get;
            }

            testAssign.IsActive = testAssignmentViewModel.IsActive;
            //testAssign.GroupId = testAssignmentViewModel.GroupId;
            //testAssign.ReferenceLabId = testAssignmentViewModel.LabId;
            testAssign.TestId = testAssignmentViewModel.TestId;
            testAssign.PanelId = testAssignmentViewModel.PanelId;
            //testAssign.ReqTypeId = testAssignmentViewModel.ReqTypeId;

            if (isUpdating)
            {
                _applicationDbContext.Update(testAssign).State = EntityState.Modified;
            }
            else
            {
                _applicationDbContext.Update(testAssign).State = EntityState.Added;
            }
            var isAffected = await _applicationDbContext.SaveChangesAsync() > 0;
            testAssignmentViewModel.Id = testAssign.Id;
            return isAffected;
        }

        public async Task<bool> IsTestAssignmentExistsByIdAsync(int id)
        {
            return await _applicationDbContext.TblCompendiumPanelTestAssignments.AnyAsync(x => x.Id == id);
        }

        public async Task<bool> DeleteAssignmentByIdAsync(int id)
        {
            return await _applicationDbContext.TblCompendiumPanelTestAssignments
                .ExecuteUpdateAsync(x => x
                .SetProperty(_ => _.IsDeleted, true)
                .SetProperty(_ => _.DeletedBy, _connectionManager.UserId)
                .SetProperty(_ => _.DeletedDate, DateTimeNow.Get)) > 0;
        }

        public async Task<bool> AssignmentActivationByIdAsync(int id, bool isActive)
        {
            return await _applicationDbContext.TblCompendiumPanelTestAssignments
                .ExecuteUpdateAsync(x => x
                .SetProperty(_ => _.IsActive, isActive)
                .SetProperty(_ => _.UpdatedBy, _connectionManager.UserId)
                .SetProperty(_ => _.UpdatedDate, DateTimeNow.Get)) > 0;
        }

        public IQueryable<TestAssignmentModel> GetAllTestAssignments()
        {
            return _applicationDbContext.TblCompendiumPanelTestAssignments.Select(x => new TestAssignmentModel
            {
                Id = x.Id,
                IsActive = x.IsActive,
                UpdateBy = x.UpdatedBy,
                UpdateDate = x.UpdatedDate,
                //ProcessType = x.ProcessType,
                //TestId = x.TestId ?? 0,
                //LabId = x.LabId ?? 0,
                PanelId = x.PanelId ?? 0,
                //PanelGroupId = x.GroupId ?? 0,
                //ReqTypeId = x.ReqTypeId ?? 0,
                CreateBy = x.CreatedBy,
                CreateDate = x.CreatedDate
            });
        }
    }
}
