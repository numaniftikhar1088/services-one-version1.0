using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Globalization;
using System.Linq.Dynamic.Core;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Domain.Models.Response;
using TrueMed.LISManagement.Business.Interfaces;
using TrueMed.LISManagement.Domain.DTOS.Request;
using TrueMed.LISManagement.Domain.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domain.DTOS.Response;
using TrueMed.LISManagement.Domains.DTOS.Request;
using TrueMed.LISManagement.Domains.DTOS.Response;

namespace TrueMed.LISManagement.Business.Implementations
{
    public class ResultFileService : IResultFileService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly MasterDbContext _masterDbContext;
        private readonly ApplicationDbContext? _applicationDbContext;
        private readonly IBlobStorageManager _blobStorageManager;
        private readonly IDapperManager _dapperManager;
        public ResultFileService(
            IConnectionManager connectionManager,
            MasterDbContext masterDbContext,
            ApplicationDbContext? applicationDbContext,
            IBlobStorageManager blobStorageManager,
            IDapperManager dapperManager)
        {
            _connectionManager = connectionManager;
            _masterDbContext = masterDbContext;
            _applicationDbContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);
            _blobStorageManager = blobStorageManager;
            _dapperManager = dapperManager;
        }
        public async Task<RequestResponse> FileUpload(ResultFileUploadRequest request)
        {
            var response = new RequestResponse();
            //await ProccessAndUploadFiles(request);
            return response;
            #region Commented Code
            //var extension = Path.GetExtension(request.File.FileName);
            //var uniqueFileName = $"{Path.GetFileNameWithoutExtension(request.File.FileName)}_{Guid.NewGuid()}.{extension}";
            //var blobResponse = await _blobStorageManager.UploadAsync("FacilityFiles".ToLower(), uniqueFileName, request.File);
            //var tblFile = new TblUploadFileDetail()
            //{
            //    FileName = request.FileName,
            //    LabId = _connectionManager.GetLabId(),
            //    FileType = request.FileType,
            //    FileDataType = request.FileDataType,
            //    AzureLink = request.AzureLink,
            //    UploadPageName = "LIS Result",
            //    //Status = "Pending",
            //    UploadedBy = _connectionManager.UserId,
            //    UploadedDate = DateTimeNow.Get,
            //    IsDeleted = false,
            //};
            //if (request.FileType == "xls" || request.FileType == "xlsx" || request.FileType == "csv" || request.FileType == "tsv")
            //{
            //    tblFile.Status = "Pending";
            //}
            //else
            //{
            //    tblFile.Status = "Invalid";
            //}

            //await _applicationDbContext.TblUploadFileDetails.AddAsync(tblFile);
            //var ack = await _applicationDbContext.SaveChangesAsync();
            //if (ack > 0)
            //{
            //    var labId = _connectionManager.GetLabId();
            //    var columns = _applicationDbContext.TblLisresultFileTemplateSetups.Where(w => w.LabId == labId && w.IsDeleted.Equals(false)).ToList();

            //    if (ack > 0)
            //    {
            //        ////Perform the bulk copy operation here
            //        using (var bulkCopy = new SqlBulkCopy(_applicationDbContext.Database.GetDbConnection().ConnectionString))
            //        {
            //            bulkCopy.DestinationTableName = "YourDestinationTableName"; // Replace with your actual table name
            //                                                                        // Map columns if needed
            //            for (int i = 1; i <= columns.Count(); i++)
            //            {
            //                var column = columns.FirstOrDefault(f => f.CustomCellOrder == i);
            //                bulkCopy.ColumnMappings.Add(column?.SystemCellName, column?.CustomCellName);
            //            }

            //            //4bulkCopy.ColumnMappings.Add("LabId", "LabId");
            //            // Add more mappings for other columns

            //            // Assuming you have a DataTable named "dataTable" with the data to bulk insert
            //            //DataTable dataTable = CreateDataTable(); // Implement this method to create your DataTable
            //            //await bulkCopy.WriteToServerAsync(dataTable);
            //        }

            //        response.Message = "File Upload Successfully...";
            //        response.StatusCode = HttpStatusCode.OK;
            //    }
            //    else
            //    {
            //        response.Message = "File Upload Failed...";
            //        response.StatusCode = HttpStatusCode.InternalServerError;
            //    }
            //}
            #endregion
        }
        public async Task<RequestResponse> FileUploadAsync(IDResultFileUploadRequest request)
        {
            var response = new RequestResponse();
            var labId = _connectionManager.GetLabId();
            var fileName = $"IDRawResult_{DateTime.UtcNow.Ticks}_{request.File.FileName}";
            var blob = _blobStorageManager.UploadAsync(request.File, _connectionManager, fileName).GetAwaiter().GetResult();
            string fileExtension = System.IO.Path.GetExtension(request.File.FileName);
            var TblLisresultFileTemplateRecord = _applicationDbContext.TblLisresultFileTemplates.FirstOrDefault(f => f.LabId == labId && f.TemplateId == request.TemplateId);
            var tblFile = new TblUploadFileDetail()
            {
                FileName = request.File.FileName,
                LabId = _connectionManager.GetLabId(),
                FileType = blob.fileType,
                FileDataType = TblLisresultFileTemplateRecord.TemplateName,
                AzureLink = blob.uri,
                UploadPageName = "LIS Result",
                //Status = "Pending",
                UploadedBy = _connectionManager.UserId,
                UploadedDate = DateTimeNow.Get,
                IsDeleted = false,
            };

            if (fileExtension == ".xls" || fileExtension == ".xlsx" || fileExtension == ".csv" || fileExtension == ".tsv")
                tblFile.Status = "Pending";
            else
                tblFile.Status = "Invalid File";

            await _applicationDbContext.TblUploadFileDetails.AddAsync(tblFile);
            await _applicationDbContext.SaveChangesAsync();
            if (tblFile.Status == "Invalid File")
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                response.Message = "Invalid File";
                return response;
            }

            var templateId = TblLisresultFileTemplateRecord.TemplateId;
            var columns = _applicationDbContext.TblLisresultFileTemplateSetups
                .Where(w => w.LabId == labId && w.TemplateId == templateId && w.IsDeleted.Equals(false))
                .ToList();

            if (columns.Count > 0)
            {
                IExcelDataReader excelReader;
                string sheetName = "Results";

                DataTable dt = new DataTable();
                var columnHeaders = new List<TblLisresultFileTemplateSetup>();
                using (var fs = request.File.OpenReadStream())
                {
                    if (fileExtension.Trim().ToLower() == ".csv")
                        excelReader = ExcelReaderFactory.CreateCsvReader(fs);
                    else
                    {
                        if (fileExtension.Trim().ToLower() == ".xls")
                            excelReader = ExcelReaderFactory.CreateBinaryReader(fs);
                        else
                            excelReader = ExcelReaderFactory.CreateOpenXmlReader(fs);
                    }


                    if (excelReader.AsDataSet().Tables.Contains(sheetName))
                        sheetName = excelReader.AsDataSet().Tables[sheetName].TableName;
                    else
                        sheetName = excelReader.AsDataSet().Tables[0].TableName;

                    DataTable clonedDataTableWithData = excelReader.AsDataSet().Tables[sheetName].Copy();



                    var columnList = columns.Select(s => s.CustomCellName).ToList();
                    int removeToIndex = -1;
                    int RowNumber = 2;
                    foreach (DataRow row in clonedDataTableWithData.Rows)
                    {
                        removeToIndex++;

                        var rowValues = row.ItemArray.Select(obj => obj.ToString().Replace(" ", string.Empty))
                            .Where(f => !string.IsNullOrEmpty(f)).ToList();

                        if (columnList.Take(3).Any(a => rowValues.Take(3).Contains(a)))
                        {
                            removeToIndex = removeToIndex - 1;
                            break;
                        }
                        RowNumber++;
                    }
                    for (int i = 0; i <= removeToIndex; i++)
                    {
                        clonedDataTableWithData.Rows[i].Delete();
                    }
                    clonedDataTableWithData.AcceptChanges();
                    #region===========================================================
                    if (clonedDataTableWithData.Rows.Count == 0)
                    {
                        tblFile.Status = "Invalid Format";
                        _applicationDbContext.TblUploadFileDetails.Update(tblFile);
                        await _applicationDbContext.SaveChangesAsync();

                        response.StatusCode = HttpStatusCode.BadRequest;
                        response.Message = "Invalid Format";
                        return response;
                    }


                    #endregion=========================================================
                    var fileColumns = clonedDataTableWithData.Rows[0].ItemArray
                        .Select(obj => obj.ToString().Replace(" ", string.Empty)).ToList();

                    // Assuming columns is a list of valid column names
                    var invalidColumns = fileColumns.Except(columns.Select(c => c.CustomCellName)).ToList();

                    if (invalidColumns.Any())
                    {
                        tblFile.Status = "Invalid Format";
                        _applicationDbContext.TblUploadFileDetails.Update(tblFile);
                        await _applicationDbContext.SaveChangesAsync();

                        response.StatusCode = HttpStatusCode.BadRequest;
                        response.Message = "Invalid Format";//"Invalid columns found in the file: " + string.Join(", ", invalidColumns);
                        return response;
                    }

                    columnHeaders = columns.Where(s => fileColumns.Contains(s.CustomCellName)).ToList();
                    for (int i = 0; i < columnHeaders.Count; i++)
                    {
                        var columnName = columnHeaders[i].CustomCellName.ToString();
                        clonedDataTableWithData.Columns[i].ColumnName = columnName;
                    }
                    //clonedDataTableWithData.Columns.Clear();
                    //foreach (var columnHeader in columnHeaders)
                    //{
                    //    clonedDataTableWithData.Columns.Add(columnHeader.CustomCellName.ToString());
                    //}
                    clonedDataTableWithData.Rows[0].Delete();
                    clonedDataTableWithData.AcceptChanges();
                    dt = clonedDataTableWithData;
                    #region============================================= add FileId column
                    var uploadFileId = tblFile.Id;

                    //// Create a new DataColumn for UploadFileId and set its value to uploadFileId
                    var uploadFileIdColumn = new DataColumn("UploadFileID", typeof(int));
                    dt.Columns.Add(uploadFileIdColumn);

                    foreach (DataRow row in dt.Rows)
                    {
                        row["UploadFileID"] = uploadFileId;
                    }
                    #endregion========================================== add FileId column
                    #region============================================= add RowId column

                    //// Create a new DataColumn for UploadFileId and set its value to uploadFileId
                    var RowNumberColumn = new DataColumn("RowNumber", typeof(int));
                    dt.Columns.Add(RowNumberColumn);

                    foreach (DataRow row in dt.Rows)
                    {
                        row["RowNumber"] = RowNumber++;
                    }
                    #endregion========================================== add RowId column

                }
                using (var bulkCopy = new SqlBulkCopy(_connectionManager.CONNECTION_STRING))
                {
                    bulkCopy.DestinationTableName = "[dbo].[tblIDLISRawResultData]";

                    bulkCopy.ColumnMappings.Add("UploadFileID", "UploadFileID");
                    bulkCopy.ColumnMappings.Add("RowNumber", "RowNumber");
                    for (int i = 1; i <= columns.Count(); i++)
                    {
                        var column = columns.FirstOrDefault(f => f.CustomCellOrder == i);

                        if (columnHeaders.Any(a => a.CustomCellName == column.CustomCellName))
                            bulkCopy.ColumnMappings.Add(column?.CustomCellName, column?.SystemCellName);
                    }

                    await bulkCopy.WriteToServerAsync(dt);
                }

                var execute_sp = _dapperManager.SP_Execute<int>("[dbo].[sp_CalculateIDDigitalResults]").GetAwaiter().GetResult().FirstOrDefault(); ;
                if (execute_sp == 1)
                {
                    response.StatusCode = HttpStatusCode.OK;
                    response.Message = "Bulk data stored successfully...";
                }
                else
                {
                    response.StatusCode = HttpStatusCode.OK;
                    response.Message = "Something went wrong...";
                }
                //response.StatusCode = HttpStatusCode.OK;
                //response.Message = "Bulk data stored successfully...";
            }
            return response;
        }
        #region Queries
        public DataQueryResponse<List<ResultFileResponse>> GetResultFiles(DataQueryModel<ResultFileQueryModel> query)
        {
            var response = new DataQueryResponse<List<ResultFileResponse>>();

            var labID = _connectionManager.GetLabId();
            #region Source
            var tblUploadFileDetails = _applicationDbContext.TblUploadFileDetails.Where(w => w.UploadPageName.ToLower() == "lis result" && w.LabId == labID && w.IsDeleted.Equals(query.QueryModel.IsArchived)).ToList();
            var tblUsers = _masterDbContext.TblUsers.ToList();
            #endregion
            #region Query
            var dataSource = (tblUploadFileDetails
                              .Select(s => new ResultFileResponse()
                              {
                                  Id = s.Id,
                                  FileName = s.FileName,
                                  FileDataType = s.FileDataType,
                                  AzureLink = s.AzureLink,
                                  UploadedDate = Convert.ToDateTime(s.UploadedDate).ToString("MM-dd-yyyy"),
                                  UploadedTime = Convert.ToDateTime(s.UploadedDate).ToString("hh:mm:ss"),
                                  UploadedBy = s.UploadedBy != null ? tblUsers.FirstOrDefault(f => f.Id == s.UploadedBy)?.FirstName != null ? tblUsers.FirstOrDefault(f => f.Id == s.UploadedBy)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == s.UploadedBy)?.LastName : s.UploadedBy : "",
                                  Status = s.Status,

                              })).ToList();
            #endregion
            #region Filter


            if (!string.IsNullOrEmpty(query.QueryModel?.FileName))
            {
                dataSource = dataSource.Where(f => f.FileName != null && f.FileName.Trim().ToLower().Contains(query.QueryModel?.FileName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.UploadedDate))
            {
                dataSource = dataSource.Where(f => f.UploadedDate != null && f.UploadedDate.Trim().ToLower().Contains(query.QueryModel?.UploadedDate.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Status))
            {
                dataSource = dataSource.Where(f => f.Status != null && f.Status.Trim().ToLower().Contains(query.QueryModel?.Status.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.UploadedBy))
            {
                dataSource = dataSource.Where(f => f.UploadedBy != null && f.UploadedBy.Trim().ToLower().Contains(query.QueryModel?.UploadedBy.Trim().ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();

            }
            else
            {
                dataSource = dataSource.AsQueryable().OrderBy($"id desc").ToList();
            }

            response.Total = dataSource.Count();
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion
            response.StatusCode = HttpStatusCode.OK;
            response.Data = dataSource;

            return response;
        }
        #endregion
        public RequestResponse Archive(int[] selectedRow)
        {
            RequestResponse response = new RequestResponse();
            foreach (int row in selectedRow)
            {
                var existing = _applicationDbContext.TblUploadFileDetails.FirstOrDefault(f => f.Id == row);
                if (existing != null)
                {
                    existing.IsDeleted = true;
                    existing.DeletedBy = _connectionManager.UserId;
                    existing.DeletedDate = DateTimeNow.Get;
                    _applicationDbContext.TblUploadFileDetails.Update(existing);
                }
            }
            var ack = _applicationDbContext.SaveChanges();
            if (ack > 0)
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Message = "Request Successfully Processed.";

            }
            return response;
        }
        public DataQueryResponse<List<IDResultFileLogsResponse>> GetLogsById(int id)
        {
            DataQueryResponse<List<IDResultFileLogsResponse>> response = new DataQueryResponse<List<IDResultFileLogsResponse>>();

            var tblIdlisrawResultData = _applicationDbContext?.TblIdlisrawResultData.Where(w => w.UploadFileId == id && !string.IsNullOrEmpty(w.ExceptionMessage)).ToList();
            var tblRequisitionMasters = _applicationDbContext?.TblRequisitionMasters.Where(w => w.IsDeleted.Equals(false)).ToList();
            var tblRequisitionOrders = _applicationDbContext?.TblRequisitionOrders.Where(w => w.IsDeleted.Equals(false)).ToList();

            #region Query
            var dataSource = (from Source_1 in tblIdlisrawResultData
                              join Source_2 in tblRequisitionOrders on Source_1?.RequisitionOrderId equals Source_2?.RequisitionOrderId

                              into Combine_1
                              from Source_1_2 in Combine_1.DefaultIfEmpty()

                              join Source_3 in tblRequisitionMasters on Source_1_2?.RequisitionId equals Source_3?.RequisitionId
                              into Combine_2
                              from Source_1_3 in Combine_2.DefaultIfEmpty()

                              select new
                              {
                                  lisrawResultData = Source_1,
                                  RecordInfo = Source_1_2,
                                  ReqMaster = Source_1_3
                              })
                              .Select(s => new IDResultFileLogsResponse()
                              {
                                  RowNumber = s.lisrawResultData?.RowNumber ?? 0,
                                  RecordId = s.RecordInfo?.RequisitionOrderId ?? null,
                                  Accession = s.lisrawResultData?.SampleName ?? null,
                                  PatientName = s.ReqMaster?.FirstName + " " + s.ReqMaster?.LastName,
                                  ErrorMessage = s.lisrawResultData?.ExceptionMessage,

                              }).ToList();

            #endregion

            response.StatusCode = HttpStatusCode.OK;
            response.Data = dataSource;

            return response;
        }
        public async Task<List<CommonLookupResponse>> GetFileTypesLookup()
        {
            var response = new List<CommonLookupResponse>();

            var LabId = _connectionManager.GetLabId();
            var lookupResponse = await _applicationDbContext.TblLisresultFileTemplates.Where(f => f.LabId == LabId).Select(s => new CommonLookupResponse() { Label = s.TemplateName, Value = s.TemplateId }).OrderBy(o => o.Label).ToListAsync();
            response = lookupResponse;

            return response;

        }
        //public async Task<List<CommonLookupResponse>> Lab_SideRoles_Lookup()
        //{
        //    var response = new List<CommonLookupResponse>();

        //    var lookupResponse = await _applicationDbContext.TblRoles.Where(f => f.IsDeleted == false).Select(s => new CommonLookupResponse() { Label = s.Name, Value = s.Id }).ToListAsync();
        //    response = lookupResponse;

        //    return response;
        //}
        public Task UploadIDSheetAndProcessData(List<IFormFile> files)
        {
            throw new NotImplementedException();
        }


    }
}
