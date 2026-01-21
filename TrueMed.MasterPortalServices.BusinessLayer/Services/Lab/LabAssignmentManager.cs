using Microsoft.EntityFrameworkCore;
using System;
using TrueMed.Domain.Helpers.ExtentionData;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed.Domain.Repositories.Identity.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Response;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Interfaces;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Lab
{
    public static class LabAssignmentManager
    {
        public static async Task<DataReponseViewModel<LabAssignmentResponseViewModel>> GetReferenceLabsAssignmentsAsync(
            IConnectionManager connectionManager,
            DataQueryViewModel<ReferenceLabAssignmentQueryViewModel>? dataQuery = null, params int[] exceptedLabIds)
        {
            var labManagement = connectionManager.GetService<ILabManagement>();
            var labAssignmentManagement = connectionManager.GetService<ILabAssignmentManagement>();
            var userManagement = connectionManager.GetService<IUserManagement>();

            var labs = labManagement.GetAllLabs(exceptedLabIds);
            var referenceLabs = labAssignmentManagement.GetAllReferenceLabsAssignment();

            var labsAssignementQuery = (from refD in referenceLabs
                                        join refLabD in labs
                                        on refD.ReferenceLabId equals refLabD.Id
                                        join priLabD in labs
                                        on refD.PrimaryLabId equals priLabD.Id
                                        select new LabAssignmentResponseViewModel
                                        {
                                            ReferenceLabName = refLabD.LabDisplayName + "(" + refLabD.LabName + ")",
                                            PrimaryLabName = priLabD.LabDisplayName + "(" + priLabD.LabName + ")",
                                            PrimaryLabId = refD.PrimaryLabId,
                                            AssignmentLabType = refD.LabType,
                                            ReferenceLabId = refD.ReferenceLabId,
                                            Status = refD.Status,
                                            CreateDate = refD.CreateTime,
                                            CreateBy = refD.CreateByUserId,
                                            ReferenceLabCLIA = refLabD.CLIA
                                        });

            var totalRecords = 0;

            var referenceLabsUserIds = await referenceLabs.Select(x => x.CreateByUserId).ToListAsync();

            var users = await userManagement
                .GetAllUsers(null)
                .Where(x => referenceLabsUserIds.Contains(x.Id))
                .Select(x => new { x.Id, Name = x.FirstName + " " + x.MiddleName + " " + x.LastName })
                .ToListAsync();

            var labsAssignement = await labsAssignementQuery.ToListAsync();

            labsAssignement = labsAssignement.Join(users, x => x.CreateBy, x => x.Id, (pri, refe) =>
            new LabAssignmentResponseViewModel
            {
                ReferenceLabName = pri.ReferenceLabName,
                PrimaryLabName = pri.PrimaryLabName,
                PrimaryLabId = pri.PrimaryLabId,
                AssignmentLabType = pri.AssignmentLabType,
                ReferenceLabId = pri.ReferenceLabId,
                Status = pri.Status,
                CreateDate = pri.CreateDate,
                CreateBy = pri.CreateBy,
                CreateByName = refe.Name,
                ReferenceLabCLIA = pri.ReferenceLabCLIA
            }).ToList();

            if (dataQuery != null)
            {
                if (dataQuery.QueryModel != null)
                {
                    if (!string.IsNullOrWhiteSpace(dataQuery.QueryModel.LabName))
                        labsAssignement = labsAssignement.Where(x => x.ReferenceLabName.Contains(dataQuery.QueryModel.LabName) || x.ReferenceLabName.Contains(dataQuery.QueryModel.LabName)).ToList();
                    if (dataQuery.QueryModel.LabApprovementStatus != null)
                        labsAssignement = labsAssignement.Where(x => x.Status == dataQuery.QueryModel.LabApprovementStatus).ToList();
                    if (dataQuery.QueryModel.LabIds != null)
                        labsAssignement = labsAssignement.Where(x => dataQuery.QueryModel.LabIds.Contains(x.ReferenceLabId)).ToList();
                    if (dataQuery.QueryModel.LabType != null)
                        labsAssignement = labsAssignement.Where(x => x.AssignmentLabType == dataQuery.QueryModel.LabType).ToList();
                }
                totalRecords = labsAssignementQuery.Count();
                labsAssignement = labsAssignement.Skip((dataQuery.PageNumber - 1) * dataQuery.PageSize).Take(dataQuery.PageSize).ToList();
            }
            return new DataReponseViewModel<LabAssignmentResponseViewModel>(totalRecords, labsAssignement);
        }
    }
}
