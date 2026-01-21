using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Business.Interface;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;

namespace TrueMed.RequisitionManagement.Business.Services.Implementation
{
    public class PrinterSetupService : IPrinterSetupService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext _appDbContext;
        private readonly MasterDbContext _masterDbContext;

        public PrinterSetupService(IConnectionManager connectionManager, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _appDbContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);
            _masterDbContext = masterDbContext;
            LoggedInUser = connectionManager.UserId;

        }
        public string LoggedInUser { get; set; }

        #region Queries
        public DataQueryResponse<List<PrinterSetupResponse>> GetPrinters(DataQueryModel<PrinterSetupQueryModel> query)
        {
            var response = new DataQueryResponse<List<PrinterSetupResponse>>();

            var labID = _connectionManager.GetLabId();
            #region Source
            var tblUploadFileDetails = _appDbContext.TblPrinterSetups.Where(w => w.IsDeleted.Equals(false)).ToList();
            var TblLabs = _masterDbContext.TblLabs.ToList();
            #endregion
            #region Query
            var dataSource = (tblUploadFileDetails
                              .Select(s => new PrinterSetupResponse()
                              {
                                  Id = s.Id,
                                  PrinterName = s.PrinterName,
                                  BrandName = s.BrandName,
                                  ModelNumber = s.ModelNumber,
                                  LabelSize = s.LabelSize,
                                  LabelType = s.LabelType,
                                  IsDefault = s.IsDefault,
                                  LabId = s.LabId,
                                  LabName = s.LabId !=null?TblLabs.FirstOrDefault(f => f.LabId == s.LabId)?.DisplayName: null,

                              })).OrderByDescending(x => x.Id).ToList();
            #endregion
            #region Filter


            if (!string.IsNullOrEmpty(query.QueryModel?.PrinterName))
            {
                dataSource = dataSource.Where(f => f.PrinterName != null && f.PrinterName.Trim().ToLower().Contains(query.QueryModel?.PrinterName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.BrandName))
            {
                dataSource = dataSource.Where(f => f.BrandName != null && f.BrandName.Trim().ToLower().Contains(query.QueryModel?.BrandName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ModelNumber))
            {
                dataSource = dataSource.Where(f => f.ModelNumber != null && f.ModelNumber.Trim().ToLower().Contains(query.QueryModel?.ModelNumber.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LabelSize))
            {
                dataSource = dataSource.Where(f => f.LabelSize != null && f.LabelSize.Trim().ToLower().Contains(query.QueryModel?.LabelSize.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LabelType))
            {
                dataSource = dataSource.Where(f => f.LabelType != null && f.LabelType.Trim().ToLower().Contains(query.QueryModel?.LabelType.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LabName))
            {
                dataSource = dataSource.Where(f => f.LabName != null && f.LabName.Trim().ToLower().Contains(query.QueryModel?.LabName.Trim().ToLower())).ToList();
            }
            if (query.QueryModel?.LabId > 0)
            {
                dataSource = dataSource.Where(f => f.LabId.Equals(query.QueryModel.LabId)).ToList();
            }
            if (query.QueryModel?.IsDefault != null)
            {
                dataSource = dataSource.Where(f => f.IsDefault.Equals(query.QueryModel.IsDefault)).ToList();
            }
            response.Total = dataSource.Count();


            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();
            }
            else
            {
                dataSource = dataSource.AsQueryable().OrderBy("id desc").ToList();
            }

            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion
            response.StatusCode = HttpStatusCode.OK;
            response.Data = dataSource;

            return response;
        }
        public async Task<RequestResponse> DeleteById(int id)
        {
            var response = new RequestResponse();

            if (id > 0)
            {
                var existingEntityForSofDelete = _appDbContext.TblPrinterSetups.Where(w => w.Id == id).FirstOrDefault();
                if (existingEntityForSofDelete != null)
                {
                    existingEntityForSofDelete.IsDeleted = true;

                    _appDbContext.TblPrinterSetups.Update(existingEntityForSofDelete);
                    var ack = await _appDbContext.SaveChangesAsync();
                    if (ack > 0)
                    {
                        response.Message = "Record Deleted Successfully !";
                        response.HttpStatusCode = Status.Success;
                        response.Data = existingEntityForSofDelete;
                    }
                }
                else
                {
                    response.Message = $"Record:{id} Is Not Exist In Our System !";
                    response.HttpStatusCode = Status.Success;
                }
            }
            else
            {
                response.Message = $"Record:{id} Is Invalid !";
                response.HttpStatusCode = Status.Success;
            }

            return response;
        }
        #endregion
        public async Task<RequestResponse> SavePrinterSetupAsync(PrinterSetupRequest request)
        {
            var response = new RequestResponse();

            _appDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

            var existingisDefault = _appDbContext.TblPrinterSetups.FirstOrDefault(f => f.LabId == request.LabId && f.IsDefault.Equals(true));

            var entity = new TblPrinterSetup();
            entity.Id = request.Id;
            entity.PrinterName = request.PrinterName;
            entity.BrandName = request.BrandName;
            entity.ModelNumber = request.ModelNumber;
            entity.LabelSize = request.LabelSize;
            entity.LabelType = request.LabelType;
            entity.LabId = request.LabId;
            entity.IsDeleted = false;
            if(entity.IsDefault == null)
            {
                entity.IsDefault = false;
            }
            else
            {
                entity.IsDefault = Convert.ToBoolean(request.IsDefault);
            }
            if (entity.Id > 0)
            {
                var getRecordForEdit = await _appDbContext.TblPrinterSetups.FindAsync(entity.Id);
                if (getRecordForEdit != null)
                {
                    if (request.IsDefault.Equals(true) && existingisDefault != null)
                    {
                        if (existingisDefault.Id != entity.Id)
                        {
                            response.Message = "Only one record can be default...";
                            response.HttpStatusCode = Status.AlreadyExists;
                            return response;
                        }
                    }
                    else
                    {
                        _appDbContext.TblPrinterSetups.Update(entity);
                        response.Message = "Record is Updated...";
                    }

                    

                }
                else
                {
                    response.Message = $"Record is not exist against ID : {entity.Id} in our system...";
                    response.HttpStatusCode = Status.Success;
                    //response.Status = "Failed !";
                    //response.Message = "Request Failed !";
                    return response;
                }
            }
            else
            {
                if (request.IsDefault == true)
                {
                    if (existingisDefault != null)
                    {
                        response.Message = "Only one record can be default...";
                        response.HttpStatusCode = Status.AlreadyExists;
                        return response;
                    }

                }
                else
                {
                    await _appDbContext.TblPrinterSetups.AddAsync(entity);
                    response.Message = "Record is Added...";
                }
            }

            var ack = await _appDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                //response.Message = "Success !";
            }
            return response;
        }
    }
}
