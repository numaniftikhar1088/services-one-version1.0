using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using TrueMed.CompendiumManagement.Domain.Models.Blood_Compendium.Request;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.CompendiumManagement.Domain.Repositories.Blood_Compendium.Interfaces;
using TrueMed.CompendiumManagement.Domain.Repositories.Specimen.Interfaces;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;

namespace TrueMed.CompendiumManagement.Business.Services.Blood_Compendium
{
    public static class TestSetupManager
    {
        public async static Task<CompendiumResult> SaveOrUpdateIndividualTestSetupAsync(IndividualSetupViewModel setupView, IConnectionManager connectionManager)
        {
            using (TransactionScope transactionScope = new TransactionScope( 
                TransactionScopeOption.Required, 
                new TransactionOptions { IsolationLevel = IsolationLevel.ReadUncommitted },
                TransactionScopeAsyncFlowOption.Enabled))
            {
                var compendiumResult = CompendiumResult.Failed;

                var testSetupManagement = connectionManager.GetService<ITestSetupManagement>();
                var specimenManagement = connectionManager.GetService<ISpecimenManagement>();
                var mapper = connectionManager.GetService<IMapper>();

                var isUpdating = setupView is UpdateIndividualSetupViewModel;

                if (!await specimenManagement.IsSpecimenTypeExistsById((int)setupView.SpecimenType))
                {
                    compendiumResult.AddError(nameof(setupView.SpecimenType), TrueMed.Domain.Model.Identity.Validator.InvalidValue);
                }

                if (compendiumResult.HasErrors)
                    return compendiumResult;

                var sourceView = new IndividualSetupViewModel();

                if (await testSetupManagement.IsTestSetupExistsByTestIdAsync((int)setupView.TestId))
                {
                    sourceView = mapper.Map<UpdateIndividualSetupViewModel>(setupView);
                }
                else
                {
                    sourceView = mapper.Map<IndividualSetupViewModel>(setupView);
                }

                var isDone = await testSetupManagement.SaveOrUpdateIndividualTypeSetupsAsync(sourceView);
                if (isDone && (isDone = await testSetupManagement.UpdateDepedencyTestAgainstTestById((int)setupView.TestId, (int)setupView.DependencyTestId)))
                {
                    transactionScope.Complete();
                    return compendiumResult.MakeSuccessed();
                }
                else
                {
                    return compendiumResult.MakeFailed();
                }
            }
        }
    }
}
