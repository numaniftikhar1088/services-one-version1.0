using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Domain.Models.Response;
using TrueMed.LISManagement.Domain.DTOS.Request;
using TrueMed.LISManagement.Domain.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domain.DTOS.Response;
using TrueMed.LISManagement.Domains.DTOS.Request;
using TrueMed.LISManagement.Domains.DTOS.Response;

namespace TrueMed.LISManagement.Business.Interfaces
{
    public interface IResultFileService
    {
        Task<RequestResponse> FileUpload(ResultFileUploadRequest request);
        Task<RequestResponse> FileUploadAsync(IDResultFileUploadRequest request);
        DataQueryResponse<List<ResultFileResponse>> GetResultFiles(DataQueryModel<ResultFileQueryModel> query);
        RequestResponse Archive(int[] selectedRow);
        DataQueryResponse<List<IDResultFileLogsResponse>> GetLogsById(int id);
        Task UploadIDSheetAndProcessData(List<IFormFile> files);
        Task<List<CommonLookupResponse>> GetFileTypesLookup();
    }
}
