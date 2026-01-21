using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.CompendiumManagement.Domain.Models.Blood_Compendium.Dtos;
using TrueMed.CompendiumManagement.Domain.Models.Blood_Compendium.Request;
using TrueMed.CompendiumManagement.Domain.Repositories.Blood_Compendium.Interfaces;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Blood_Compendium.Implementation
{
    public class TestSetupManagement : ITestSetupManagement
    {
        private readonly ApplicationDbContext _appDbContext;
        private readonly IConnectionManager _connectionManager;
        private readonly IMapper _mapper;

        public TestSetupManagement(ApplicationDbContext applicationDbContext,
            IConnectionManager connectionManager, IMapper mapper)
        {
            this._appDbContext = applicationDbContext;
            this._connectionManager = connectionManager;
            this._mapper = mapper;
        }

        public async Task<bool> SaveOrUpdateIndividualTypeSetupsAsync(IndividualSetupViewModel individualSetupViewModel)
        {
            var isUpdating = individualSetupViewModel is UpdateIndividualSetupViewModel;
            if (isUpdating && !await IsTestSetupExistsByTestIdAsync((int)individualSetupViewModel.TestId))
            {
                return false;
            }

            var individualSetupType = await _appDbContext.TblCompendiumTestConfigurations.FirstOrDefaultAsync(x => x.TestId == (int)individualSetupViewModel.TestId);
            if (individualSetupType == null)
            {
                individualSetupType = new TrueMed.Domain.Models.Database_Sets.Application.TblCompendiumTestConfiguration();
                individualSetupType.CreatedBy = _connectionManager.UserId;
                individualSetupType.CreatedDate = DateTimeNow.Get;
            }
            else
            {
                individualSetupType.UpdatedBy = _connectionManager.UserId;
                individualSetupType.UpdatedDate = DateTimeNow.Get;
            }

            //mapping
            _mapper.Map(individualSetupViewModel, individualSetupType);

            if (isUpdating)
                _appDbContext.Update(individualSetupType).State = EntityState.Modified;
            else
                _appDbContext.Update(individualSetupType).State = EntityState.Added;

            return await _appDbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> IsTestSetupExistsByTestIdAsync(int testId)
        {
            return await _appDbContext.TblCompendiumTestConfigurations.AnyAsync(x => x.TestId == testId);
        }

        public async Task<bool> DeleteTestSetupByTestIdAsync(int testId)
        {
            return await _appDbContext
                .TblCompendiumTestConfigurations
                .Where(x => x.TestId == testId)
                .ExecuteUpdateAsync(x => x
                .SetProperty(_ => _.IsDeleted, true)
                .SetProperty(_ => _.UpdatedBy, _connectionManager.UserId)
                .SetProperty(_ => _.UpdatedDate, DateTimeNow.Get)
                ) > 0;
        }

        public async Task<bool> AddDepedencyTestAgainstTestById(int parentTestId, int childTestId)
        {
            if (await IsDepedencyTestExistsAgainstTestById(parentTestId))
                return false;
            _appDbContext.TblCompendiumDependencyAndReflexTests.Add(new TrueMed.Domain.Models.Database_Sets.Application.TblCompendiumDependencyAndReflexTest
            {
                ChildTestAssignmentId = childTestId,
                ParentTestAssignmentId = parentTestId,
                ChildType = "Dependency",
                CreatedBy = _connectionManager.UserId,
                CreatedDate = DateTimeNow.Get,
                IsActive = true
            });
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateDepedencyTestAgainstTestById(int parentTestId, int childTestId)
        {
            if (await IsDepedencyTestExistsAgainstTestById(parentTestId))
                return await _appDbContext
                    .TblCompendiumDependencyAndReflexTests
                    .Where(x => x.ParentTestAssignmentId == parentTestId)
                    .ExecuteUpdateAsync(x => x
                    .SetProperty(_ => _.ChildTestAssignmentId, childTestId)
                    .SetProperty(_ => _.UpdatedBy, _connectionManager.UserId)
                    .SetProperty(_ => _.UpdatedDate, DateTimeNow.Get)) > 0;
            else
                return await AddDepedencyTestAgainstTestById(parentTestId, childTestId);
        }

        public async Task<bool> IsDepedencyTestExistsAgainstTestById(int testId)
        {
            return await _appDbContext.TblCompendiumDependencyAndReflexTests.AnyAsync(x => x.ParentTestAssignmentId == testId);
        }

        public IQueryable<TestSetupModel> GetAllTestSetups()
        {
            return from setup in _appDbContext.TblCompendiumTestConfigurations
                   join depedency in _appDbContext.TblCompendiumDependencyAndReflexTests
                   on setup.TestId equals depedency.ParentTestAssignmentId
                   join specimen in _appDbContext.TblSpecimenTypes
                   on setup.SpecimenTypeId equals specimen.SpecimenTypeId
                   join dependencyTest in _appDbContext.TblCompendiumTests
                   on depedency.ChildTestAssignmentId equals dependencyTest.Id
                   join parentTest in _appDbContext.TblCompendiumTests
                   on setup.TestId equals parentTest.Id
                   select new TestSetupModel
                   {
                       TestId = setup.TestId ?? 0,
                       DependencyTestId = depedency.ChildTestAssignmentId ?? 0,
                       TestType = depedency.ChildType,
                       DependencyTestName = dependencyTest.TestName,
                       OrderMethod = setup.InstrumentResultingMethod,
                       ResultMethod = setup.ResultType,
                       SpecimenType = setup.SpecimenTypeId ?? 0,
                       SpecimenTypeName = specimen.SpecimenType,
                       UOM = setup.Unit
                   };
        }

    }
}
