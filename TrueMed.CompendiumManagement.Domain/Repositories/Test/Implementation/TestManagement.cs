using Dapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Test.Implementation
{
    public class TestManagement : ITestManagement
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext? _applicationDbContext;

        public TestManagement(
            IConnectionManager connectionManager,
            ApplicationDbContext applicationDbContext
            )
        {
            this._connectionManager = connectionManager;
            _applicationDbContext = applicationDbContext;
        }

        public async Task<bool> DeleteTestByIdAsync(int id)
        {
            return await _applicationDbContext.TblCompendiumTests
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(x => x
                .SetProperty(_ => _.IsDeleted, true)
                .SetProperty(_ => _.DeletedDate, DateTimeNow.Get)
                .SetProperty(_ => _.DeletedBy, _connectionManager.UserId)) > 0;
        }

        public async Task<string?> GenerateTimitCodeByTestIdAsync(int id)
        {
            var dbConnection = _applicationDbContext
                .Database
                .GetDbConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@id", id);
            return await SqlMapper.ExecuteScalarAsync<string>(dbConnection,
                "SELECT dbo.[Fn_GenerateTmitTestCodeByTestId](@id)",
                parameters);
        }

        public async Task<bool> IsTestExistsByIdAsync(int id)
        {
            return await _applicationDbContext.TblCompendiumTests.AnyAsync(x => x.Id == id);
        }

        public IQueryable<TestModel> GetAllTests()
        {
            return _applicationDbContext.TblCompendiumTests
                .Join(_applicationDbContext.TblDepartments,
                prip => prip.Department,
                refer => refer.DeptId, (pri, refer) => new TestModel
                {
                    Id = pri.Id,
                    Name = pri.TestName,
                    CreateBy = pri.CreatedBy,
                    CreateDate = pri.CreatedDate,
                    Department = pri.Department,
                    DepartmentName = refer.DepartmentName,
                    IsActive = pri.IsActive,
                    RequisitionType = pri.ReqTypeId,
                    TmitCode = pri.Tmitcode,
                });
        }

        public async Task<int?> GetTestIdByNameAsync(string name)
        {
            return await _applicationDbContext.TblCompendiumTests
                .Where(x => x.TestName.ToLower() == name.ToLower())
                .Select(x => x.Id).FirstOrDefaultAsync();
        }

        public async Task<bool> IsTestExistsByNameAsync(string name)
        {
            return await _applicationDbContext.TblCompendiumTests
                .AnyAsync(x => x.TestName.ToLower().ToLower() == name.ToLower().ToLower());

        }

        public async Task<bool> IsTestNameValidAsync(KeyValuePairViewModel<int?> uniqueKeyValidation)
        {
            if (uniqueKeyValidation.Id != null && await GetTestIdByNameAsync(uniqueKeyValidation.KeyValue) == (int)uniqueKeyValidation.Id)
            {
                return true;
            }
            else
            {
                return !await IsTestExistsByNameAsync(uniqueKeyValidation.KeyValue);
            }
        }

        public async Task<bool> SaveOrUpdateTestAsync(TestViewModel testViewModel)
        {
            var isUpdating = testViewModel is Models.Test.Request.UpdateTestViewModel;
            if (isUpdating && !await IsTestExistsByIdAsync((int)testViewModel.Id))
            {
                return false;
            }

            //name should be valid..
            if (!await IsTestNameValidAsync(new KeyValuePairViewModel<int?>
            {
                Id = testViewModel.Id,
                KeyValue = testViewModel.Name
            }))
                return false;

            var test = await _applicationDbContext.TblCompendiumTests
                 .FirstOrDefaultAsync(x => x.Id == testViewModel.Id);
            if (test == null)
            {
                test = new TrueMed.Domain.Models.Database_Sets.Application.TblCompendiumTest();
                test.CreatedBy = _connectionManager.UserId;
                test.CreatedDate = DateTimeNow.Get;
            }
            else
            {
                test.UpdatedBy = _connectionManager.UserId;
                test.UpdatedDate = DateTimeNow.Get;
            }

            test.TestName = testViewModel.Name;
            test.ReqTypeId = testViewModel.RequisitionType;
            test.Department = testViewModel.Department;
            test.IsActive = testViewModel.IsActive;

            if (isUpdating)
                _applicationDbContext.Update(test).State = EntityState.Modified;
            else
                _applicationDbContext.Update(test).State = EntityState.Added;

            var isAffected = await _applicationDbContext.SaveChangesAsync() > 0;
            testViewModel.Id = test.Id;
            return isAffected;
        }

        public async Task<bool> TestActiviationByIdAsync(int id, bool isActive)
        {
            return await _applicationDbContext.TblCompendiumTests
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(x => x
                .SetProperty(p => p.IsActive, isActive)
                .SetProperty(p => p.UpdatedBy, _connectionManager.UserId)
                .SetProperty(p => p.UpdatedDate, DateTimeNow.Get)
                ) > 0;
        }

        public async Task<bool> UpdateTestTmitCodeByIdAsync(int id, string timitCode)
        {
            return await _applicationDbContext.TblCompendiumTests
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(x => x
                .SetProperty(p => p.Tmitcode, timitCode)
                .SetProperty(p => p.UpdatedBy, _connectionManager.UserId)
                .SetProperty(p => p.UpdatedDate, DateTimeNow.Get)
                ) > 0;
        }

        public async Task<bool> IsTmitCodeValidAsync(string timitCode)
        {
            return !await _applicationDbContext.TblCompendiumTests.AnyAsync(x => x.Tmitcode.ToLower().Trim() == timitCode.ToLower().Trim());
        }
    }
}
