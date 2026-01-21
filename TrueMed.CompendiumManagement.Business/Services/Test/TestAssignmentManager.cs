using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Interface;

namespace TrueMed.CompendiumManagement.Business.Services.Test
{
    public static class TestAssignmentManager
    {
        public static async Task<CompendiumResult> SaveOrUpdateTestAssignmentByIdAsync(TestAssignmentViewModel testAssignmentViewModel, IConnectionManager connectionManager)
        {
            var identityResult = CompendiumResult.Failed;

            var requisitionManagement = connectionManager.GetService<IRequisitionManagement>();
            var panelAssignmentManagement = connectionManager.GetService<IPanelManagement>();
            var labManagement = connectionManager.GetService<ILaboratoryManagement>();
            var panelGroupManagement = connectionManager.GetService<IPanelGroupManagement>();
            var testManagement = connectionManager.GetService<ITestManagement>();
            var testAssignmentManagement = connectionManager.GetService<ITestAssignmentManagement>();

            var isUpdating = testAssignmentViewModel is UpdateTestAssignmentViewModel;

            if (isUpdating && !await testAssignmentManagement.IsTestAssignmentExistsByIdAsync((int)testAssignmentViewModel.Id))
            {
                identityResult.AddError(nameof(testAssignmentViewModel.Id), "Invalid value, might be not found.");
            }

            if (!requisitionManagement.IsExistsTypeById((int)testAssignmentViewModel.ReqTypeId))
            {
                identityResult.AddError(nameof(testAssignmentViewModel.ReqTypeId), "Invalid value, might be not found.");
            }

            if (!labManagement.IsLabExistsById((int)testAssignmentViewModel.LabId))
            {
                identityResult.AddError(nameof(testAssignmentViewModel.LabId), "Invalid value, might be not found.");
            }

            if (!await panelAssignmentManagement.IsPanelExistsByIdAsync((int)testAssignmentViewModel.PanelId))
            {
                identityResult.AddError(nameof(testAssignmentViewModel.PanelId), "Invalid value, might be not found.");
            }

            if (!await panelGroupManagement.IsPanelGroupExistsByIdAsync((int)testAssignmentViewModel.GroupId))
            {
                identityResult.AddError(nameof(testAssignmentViewModel.GroupId), "Invalid value, might be not found.");
            }

            if (!await testManagement.IsTestExistsByIdAsync((int)testAssignmentViewModel.TestId))
            {
                identityResult.AddError(nameof(testAssignmentViewModel.TestId), "Invalid value, might be not found.");
            }

            if (identityResult.HasErrors)
            {
                return identityResult;
            }

            var isDone = await testAssignmentManagement.SaveOrUpdateTestAssignmentByIdAsync(testAssignmentViewModel);
            if (isDone)
            {
                identityResult.UpdateIdentifier(testAssignmentViewModel.Id);
                return identityResult.MakeSuccessed();
            }
            else
            {
                return identityResult.MakeFailed();
            }
        }

        public static async Task<DataReponseViewModel<Domain.Models.Test.Response.TestAssignmentViewModel>>
            SearchTestAssignmentsAsync(
            DataQueryViewModel<TestAssignQueryViewModel> dataQueryViewModel,
            IConnectionManager connectionManager)
        {
            var testAssignManagement = connectionManager.GetService<ITestAssignmentManagement>();
            var labManagement = connectionManager.GetService<ILaboratoryManagement>();
            var testManagement = connectionManager.GetService<ITestManagement>();
            var panelManagement = connectionManager.GetService<IPanelManagement>();
            var panelGroupManagement = connectionManager.GetService<IPanelGroupManagement>();
          
            var testAssigns = from testAssign in testAssignManagement.GetAllTestAssignments()
                              join test in testManagement.GetAllTests()
                              on testAssign.TestId equals test.Id
                              join panelGroup in panelGroupManagement.GetAllCompendiumGroups()
                              on testAssign.PanelGroupId equals panelGroup.Id
                              join panel in panelManagement.GetAllPanels()
                              on testAssign.PanelId equals panel.Id
                              select new Domain.Models.Test.Response.TestAssignmentViewModel
                              {
                                  Id = testAssign.Id,
                                  PanelGroupId = testAssign.PanelGroupId,
                                  PanelGroupName = panelGroup.Name,
                                  LabId = testAssign.LabId,
                                  PanelId = testAssign.PanelId,
                                  //PanelName = panel.DisplayName ?? panel.Name, 
                                  ProcessType = testAssign.ProcessType,
                                  TestId = testAssign.TestId,
                                  TestName = test.Name,
                                  IsActive = testAssign.IsActive,
                                  CreateBy = testAssign.CreateBy,
                                  CreateDate = testAssign.CreateDate
                              };

            var queryModel = dataQueryViewModel.QueryModel;
            if (queryModel != null)
            {
                if (!string.IsNullOrWhiteSpace(queryModel.PanelName))
                    testAssigns = testAssigns.Where(x => EF.Functions.Like(x.PanelName, $"%{queryModel.PanelName}%"));
                if (!string.IsNullOrWhiteSpace(queryModel.TestName))
                    testAssigns = testAssigns.Where(x => EF.Functions.Like(x.TestName, $"%{queryModel.TestName}%"));
                if (!string.IsNullOrWhiteSpace(queryModel.PanelGroupName))
                    testAssigns = testAssigns.Where(x => EF.Functions.Like(x.PanelGroupName, $"%{queryModel.PanelGroupName}%"));
            }
            return new DataReponseViewModel
               <Domain.Models.Test.Response.TestAssignmentViewModel>(
               testAssigns.Count(),
              await testAssigns
               .Skip((dataQueryViewModel.PageNumber - 1) * dataQueryViewModel.PageSize)
               .Take(dataQueryViewModel.PageSize).ToListAsync());
        }
    }
}
