using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Interface;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.CompendiumManagement.Business.Services.Test
{
    public static class TestManager
    {
        public static async Task<IdentityResult> SaveOrUpdateTestAsync(TestViewModel testViewModel, IConnectionManager connectionManager)
        {
            using (TransactionScope transactionScope = new TransactionScope(TransactionScopeOption.Required,
                new TransactionOptions() { IsolationLevel = IsolationLevel.ReadUncommitted }, TransactionScopeAsyncFlowOption.Enabled))
            {
                var testManagement = connectionManager.GetService<ITestManagement>();
                var requisitionManagement = connectionManager.GetService<IRequisitionManagement>();

                var identityResult = IdentityResult.FailedResult();

                var isUpdating = testViewModel is UpdateTestViewModel;

                if (isUpdating)
                {
                    if (!await testManagement.IsTestExistsByIdAsync((int)testViewModel.Id))
                    {
                        identityResult.AddError(nameof(testViewModel.Id), TrueMed.Domain.Model.Identity.Validator.InvalidValue);
                    }
                }

                if (!requisitionManagement.IsExistsTypeById((int)testViewModel.RequisitionType))
                {
                    identityResult.AddError(nameof(testViewModel.RequisitionType), TrueMed.Domain.Model.Identity.Validator.InvalidValue);
                }

                if (!await testManagement.IsTestNameValidAsync(new KeyValuePairViewModel<int?>
                {
                    KeyValue = testViewModel.Name,
                    Id = testViewModel.Id,
                }))
                {
                    identityResult.AddError(nameof(testViewModel.Name), TrueMed.Domain.Model.Identity.Validator.InvalidValue);
                }

                if (identityResult.HasErrors)
                    return identityResult;

                //saving test 
                var isDone = await testManagement.SaveOrUpdateTestAsync(testViewModel);
                if (isDone)
                {
                    if (!string.IsNullOrWhiteSpace(testViewModel.TMIT_Code))
                    {
                        isDone = await testManagement.IsTmitCodeValidAsync(testViewModel.TMIT_Code);
                        //if, is code valid
                        if (!isDone)
                        {
                            identityResult.AddError(nameof(testViewModel.TMIT_Code), TrueMed.Domain.Model.Identity.Validator.InvalidValue);
                        }
                    }
                    else
                    {
                        //generating tmit code 
                        testViewModel.TMIT_Code = await testManagement.GenerateTimitCodeByTestIdAsync((int)testViewModel.Id);
                        if (string.IsNullOrWhiteSpace(testViewModel.TMIT_Code))
                            return identityResult.MakeFailed();
                    }
                    //updating to TMIT Code
                    isDone = await testManagement.UpdateTestTmitCodeByIdAsync((int)testViewModel.Id, testViewModel.TMIT_Code);

                    //if done, making changing consistance 
                    if (isDone) transactionScope.Complete();

                    //updating identifier
                    identityResult.UpdateIdentifier(testViewModel.Id);

                    //creaing response
                    return identityResult.CreateResponse(isDone);
                }
                return identityResult.CreateResponse(isDone);
            }
        }

        public static async Task<DataReponseViewModel<Domain.Models.Test.Response.TestViewModel>>
            SearchTestAsync(DataQueryViewModel<TestQueryViewModel> queryModel, IConnectionManager connectionManager)
        {
            var testManagement = connectionManager.GetService<ITestManagement>();
            var requisitionManagement = connectionManager.GetService<IRequisitionManagement>();
            var requisitionTypes = await requisitionManagement.GetAllTypes().ToListAsync();

            var tests = testManagement.GetAllTests()
                .OrderByDescending(x => x.CreateDate)
                .Select(x => new Domain.Models.Test.Response.TestViewModel
                {
                    Name = x.Name,
                    Id = x.Id,
                    IsActive = x.IsActive,
                    TmitCode = x.TmitCode,
                    Department = x.Department,
                    DepartmentName = x.DepartmentName,
                    RequisitionType = x.RequisitionType,
                    CreateDate = x.CreateDate
                });



            if (queryModel != null && queryModel.QueryModel != null)
            {
                var query = queryModel.QueryModel;
                if (!string.IsNullOrEmpty(query.Name))
                    tests = tests.Where(x => EF.Functions.Like(x.Name, $"%{query.Name}%"));
                if (query.IsActive != null)
                    tests = tests.Where(x => x.IsActive == query.IsActive);
                if (query.Department != null)
                    tests = tests.Where(x => x.Department == query.Department);
                if (query.TmitCode != null)
                    tests = tests.Where(x => x.TmitCode == query.TmitCode);
            }

            var requisitionTypeIds = requisitionTypes.Select(x => x.Id).ToList();

            var testResults = await tests.Where(x => requisitionTypeIds.Contains(x.RequisitionType ?? 0))
                .Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
                .Take(queryModel.PageSize).ToListAsync();

            testResults.ForEach(x => x.RequisitionTypeName = testResults
            .Where(x => x.RequisitionType == x.RequisitionType)
            .Select(x => x.Name)
            .FirstOrDefault());

            return new DataReponseViewModel<Domain.Models.Test.Response.TestViewModel>
                (
                tests.Count(),
                testResults
               );
        }
    }
}
