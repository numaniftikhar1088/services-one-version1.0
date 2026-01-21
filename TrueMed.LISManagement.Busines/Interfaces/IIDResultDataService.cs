using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Response;
using TrueMed.LISManagement.Domain.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domain.DTOS.Response;
using TrueMed.LISManagement.Domains.DTOS.Request;
using TrueMed.LISManagement.Domains.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domains.DTOS.Response;

namespace TrueMed.LISManagement.Busines.Interfaces
{
    public interface IIDResultDataService
    {
        DataQueryResponse<List<IDResultDataResponse>> GetIdResultData(DataQueryModel<IDResultDataQueryModel> query);
        RequestResponse Archive(int[] selectedRow);
        RequestResponse Restore(int[] selectedRow);
        RequestResponse<FileContentResult> IDResultDataExportToExcel(int[]? selectedRow);
        RequestResponse<IDResultDataExpandResponse> GetIdResultDataExpand(string accessionNo);
        RequestResponse ChangeControlsStatus(ChangeControlsStatusRequest request);
        RequestResponse ChangeOrganismStatus(ChangeOrganismStatusRequest request);
        RequestResponse PublishAndValidate(IDLISResultDataValidateRequest request);
        RequestResponse BulkPublishAndValidate(IDLISResultDataValidateRequest[] request);
        RequestResponse SaveIdResultDataExpand(IDLISResultDataExpandRequest request);
        RequestResponse GenerateBlanksAgainstReqOrderId(int reqOrderId);
        DataQueryResponse<List<IDResultDataResponse>> CombineResultDataWithExpand(DataQueryModel<IDResultDataQueryModel> query);
    }
}
