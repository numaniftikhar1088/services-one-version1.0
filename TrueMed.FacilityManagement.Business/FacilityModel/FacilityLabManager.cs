using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed.Domain.Repositories.Lab.Interface;
using TrueMed.FacilityManagement.Domain.Models.Facility.DTOs;
using TrueMed.FacilityManagement.Domain.Models.Facility.Request;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using TrueMed.FacilityManagement.Domain.Repositories.Facility.Interface;

namespace TrueMed.FacilityManagement.Business.FacilityModel
{
    public static class FacilityLabAssignmentManager
    {
        //public static async Task<DataReponseViewModel<FacilityAssignmentResponseViewModel>> GetReferenceLabsAssignmentsAsync(
        //    IConnectionManager connectionManager,
        //    DataQueryViewModel<FacilityReferenceLabAssignmentQueryViewModel>? dataQuery = null, params int[] exceptedLabIds)
        //{
        //    var labManagement = connectionManager.GetService<ILaboratoryManagement>();
        //    var facilityLabAssignmentManagement = connectionManager.GetService<IFacilityLabManagement>();

        //    var labs = labManagement.GetAllLabs(exceptedLabIds);
        //    var referenceLabs = facilityLabAssignmentManagement.GetAllReferenceLabsAssignment();

        //    var totalRecords = referenceLabs.Count();

        //    if (dataQuery != null)
        //    {
        //        if (dataQuery.QueryModel != null)
        //        {
        //            if (!string.IsNullOrWhiteSpace(dataQuery.QueryModel.Name))
        //                labs = labs.Where(x => x.LabName.Contains(dataQuery.QueryModel.Name) || x.LabDisplayName.Contains(dataQuery.QueryModel.Name));
        //            if (dataQuery.QueryModel.LabApprovementStatus != null)
        //                referenceLabs = referenceLabs.Where(x => x.Status == dataQuery.QueryModel.LabApprovementStatus);
        //            if (dataQuery.QueryModel.FacilityIds != null)
        //                referenceLabs = referenceLabs.Where(x => dataQuery.QueryModel.FacilityIds.Contains(x.FacilityId));
        //            if (dataQuery.QueryModel.LabType != null)
        //                referenceLabs = referenceLabs.Where(x => x.LabType == dataQuery.QueryModel.LabType);
        //        }

        //        referenceLabs = referenceLabs.Skip((dataQuery.PageNumber - 1) * dataQuery.PageSize).Take(dataQuery.PageSize);
        //    }

        //    var referenceLabResult = await referenceLabs.Select(x => new { x.FacilityId, x.LabType, x.ReferenceLabId,x.ReqTypeId, x.Status }).ToListAsync();

        //    var referenceLabIds = referenceLabResult.Select(x => x.ReferenceLabId).ToList();

        //    var labsResult = await labs.Where(x => referenceLabIds.Contains(x.Id ?? 0)).Select(x => new { x.LabDisplayName, x.LabName, LabId = x.Id }).ToListAsync();

        //    var labsAssignement = labsResult.Join(referenceLabResult,
        //        pri => pri.LabId,
        //        refe => refe.ReferenceLabId, (pri, refe) =>
        //        new FacilityAssignmentResponseViewModel
        //        {
        //            ReferenceLabName = pri.LabDisplayName + "(" + pri.LabName + ")",
        //            FacilityId = refe.FacilityId,
        //            LabType = refe.LabType,
        //            ReqTypeId = refe.ReqTypeId,
        //            ReferenceLabId = refe.ReferenceLabId,
        //            LabApprovementStatus = refe.Status == LabApprovementStatus.Approved ? true : false
        //        }).ToArray();

        //    return new DataReponseViewModel<FacilityAssignmentResponseViewModel>(totalRecords, labsAssignement);
        //}
    }
}
