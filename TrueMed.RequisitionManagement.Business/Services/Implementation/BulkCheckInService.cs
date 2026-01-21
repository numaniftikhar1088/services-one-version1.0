using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.RequisitionManagement.Business.Services.Implementation
{
    public class BulkCheckInService : IBulkCheckInService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext _appDbContext;
        private readonly MasterDbContext _masterDbContext;
        private readonly IBlobStorageManager _blobStorageManager;
        private readonly IConfiguration _configuration;
        private readonly IDapperManager _dapper;
        private readonly ILookupManager _lookupManager;

        public BulkCheckInService(IConnectionManager connectionManager, MasterDbContext masterDbContext, IBlobStorageManager blobStorageManager, IConfiguration configuration, IDapperManager dapper, ILookupManager lookupManager)
        {
            _connectionManager = connectionManager;
            _masterDbContext = masterDbContext;
            _appDbContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);
            LoggedInUser = connectionManager.UserId;
            _blobStorageManager = blobStorageManager;
            _configuration = configuration;
            _dapper = dapper;
            _lookupManager = lookupManager;
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse<DigitalCheckINRecordResponse>> GetDigitalCheckINRecord(DigitalCheckINRecordRequest request)
        {
            var response = new RequestResponse<DigitalCheckINRecordResponse>();
            var result = new DigitalCheckINRecordResponse();
            var reqType = _appDbContext.TblLabRequisitionTypes.FirstOrDefault(f => f.MasterRequisitionTypeId == 4)?.ReqTypeId;
            var userName = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == LoggedInUser)?.FirstName + " " + _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == LoggedInUser)?.LastName;

            if (request.IsOrder)
            {
                var reqMaster = _appDbContext.TblRequisitionMasters.FirstOrDefault(w => w.OrderNumber == request.Number && w.IsDeleted == false);
                if (reqMaster != null)
                {
                    var specimen = _appDbContext.TblRequisitionSpecimensInfos.FirstOrDefault(w => w.RequisitionId == reqMaster.RequisitionId);
                    if (specimen != null)
                    {
                        var orderInfo = _appDbContext.TblRequisitionOrders.FirstOrDefault(w => w.RequisitionId == reqMaster.RequisitionId && w.RequisitionOrderId == specimen.RequisitionOrderId && w.ReqTypeId == reqType && w.IsDeleted == false);

                        var allUsers = new List<string>() {
                            reqMaster.PhysicianId,
                            reqMaster.CollectorId
                        };
                        var tblUsers = _masterDbContext.TblUsers.Where(w => allUsers.Contains(w.Id)).ToList();



                        result.RequisitionID = reqMaster.RequisitionId;
                        result.Status = orderInfo.DateReceived != null ? "Already Checked In" : "Processing";
                        result.SpecimenID = specimen.SpecimenId;
                        result.SpecimenType = _appDbContext.TblSpecimenTypes.FirstOrDefault(f => f.SpecimenTypeId == specimen.SpecimenType).SpecimenType;
                        result.OrderNumber = reqMaster.OrderNumber;
                        result.FacilityID = reqMaster.FacilityId;
                        result.FacilityName = _appDbContext.TblFacilities.FirstOrDefault(f => f.FacilityId == reqMaster.FacilityId).FacilityName;
                        result.PatientID = reqMaster.PatientId;
                        result.FirstName = reqMaster.FirstName;
                        result.LastName = reqMaster.LastName;
                        result.DateOfBirth = reqMaster.Dob;
                        result.PhysicianID = !string.IsNullOrEmpty(reqMaster.PhysicianId) ? tblUsers.FirstOrDefault(f => f.Id == reqMaster.PhysicianId)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == reqMaster.PhysicianId)?.LastName : "";
                        result.CollectorID = !string.IsNullOrEmpty(reqMaster.CollectorId) ? tblUsers.FirstOrDefault(f => f.Id == reqMaster.CollectorId)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == reqMaster.CollectorId)?.LastName : "";
                        result.DateOfCollection = reqMaster.DateofCollection;
                        result.DateScanned = DateTime.UtcNow;
                        result.User = userName;
                        if (orderInfo.DateReceived == null)
                        {
                            orderInfo.LastWorkFlowStatus = orderInfo.WorkFlowStatus;
                            orderInfo.WorkFlowStatus = "5";
                            _appDbContext.TblRequisitionOrders.Update(orderInfo);
                        }
                    }
                    else
                    {
                        result.OrderNumber = request.Number;
                        result.DateScanned = DateTime.UtcNow;
                        result.Status = "Not Found";

                    }
                }
                else
                {
                    result.OrderNumber = request.Number;
                    result.DateScanned = DateTime.UtcNow;
                    result.Status = "Not Found";

                }
            }
            else
            {
                var specimen = _appDbContext.TblRequisitionSpecimensInfos.FirstOrDefault(w => w.SpecimenId == request.Number);
                if (specimen != null)
                {

                    var reqMaster = _appDbContext.TblRequisitionMasters.FirstOrDefault(w => w.RequisitionId == specimen.RequisitionId && w.IsDeleted == false);
                    var allUsers = new List<string>() {
                            reqMaster.PhysicianId,
                            reqMaster.CollectorId
                        };
                    var tblUsers = _masterDbContext.TblUsers.Where(w => allUsers.Contains(w.Id)).ToList();

                    var orderInfo = _appDbContext.TblRequisitionOrders.FirstOrDefault(w => w.RequisitionId == reqMaster.RequisitionId && w.RequisitionOrderId == specimen.RequisitionOrderId && w.ReqTypeId == reqType && w.IsDeleted == false);
                    result.RequisitionID = reqMaster.RequisitionId;
                    result.Status = orderInfo.DateReceived != null ? "Already Checked In" : "Processing";
                    result.SpecimenID = specimen.SpecimenId;
                    result.SpecimenType = _appDbContext.TblSpecimenTypes.FirstOrDefault(f => f.SpecimenTypeId == specimen.SpecimenType).SpecimenType;
                    result.OrderNumber = reqMaster.OrderNumber;
                    result.FacilityID = reqMaster.FacilityId;
                    result.FacilityName = _appDbContext.TblFacilities.FirstOrDefault(f => f.FacilityId == reqMaster.FacilityId).FacilityName;
                    result.PatientID = reqMaster.PatientId;
                    result.FirstName = reqMaster.FirstName;
                    result.LastName = reqMaster.LastName;
                    result.DateOfBirth = reqMaster.Dob;
                    result.PhysicianID = !string.IsNullOrEmpty(reqMaster.PhysicianId) ? tblUsers.FirstOrDefault(f => f.Id == reqMaster.PhysicianId)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == reqMaster.PhysicianId)?.LastName : "";
                    result.CollectorID = !string.IsNullOrEmpty(reqMaster.CollectorId) ? tblUsers.FirstOrDefault(f => f.Id == reqMaster.CollectorId)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == reqMaster.CollectorId)?.LastName : "";
                    result.DateOfCollection = reqMaster.DateofCollection;
                    result.DateScanned = DateTime.UtcNow;
                    result.User = userName;
                    if (orderInfo.DateReceived == null)
                    {
                        orderInfo.LastWorkFlowStatus = orderInfo.WorkFlowStatus;
                        orderInfo.WorkFlowStatus = "5";
                        orderInfo.DateReceived = DateTime.UtcNow;
                        _appDbContext.TblRequisitionOrders.Update(orderInfo);
                    }
                }
                else
                {
                    result.SpecimenID = request.Number;
                    result.DateScanned = DateTime.UtcNow;
                    result.Status = "Not Found";

                }
            }
            var record = new TblRequisitionScanHistory()
            {
                RequisitionId = result.RequisitionID,
                SpecimenId = result.SpecimenID,
                OrderNumber = result.OrderNumber,
                FacilityId = result.FacilityID,
                PatientId = result.PatientID,
                FirstName = result.FirstName,
                LastName = result.LastName,
                Dob = result.DateOfBirth,
                PhysicianId = result.PhysicianID,
                CollectorId = result.CollectorID,
                DateofCollection = result.DateOfCollection,
                ScanedDate = result.DateScanned,
                ScanedStatus = result.Status,
                CreatedBy = LoggedInUser,
                CreatedDate = DateTime.UtcNow,
            };
            _appDbContext.TblRequisitionScanHistories.Add(record);
            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                result.Id= record.Id;
                response.Data = result;
                response.Message = "Request Proccessed Successfully...";
                response.HttpStatusCode = TrueMed.Domain.Model.Identity.Status.Success;
            }

            return response;
        }
        public async Task<RequestResponse> UndoCheckIn(int id)
        {
            var response = new RequestResponse();
            var reqType = _appDbContext.TblLabRequisitionTypes.FirstOrDefault(f => f.MasterRequisitionTypeId == 4).ReqTypeId;

            var existingRecord = _appDbContext.TblRequisitionScanHistories.FirstOrDefault(f => f.Id == id);
            if (existingRecord != null)
            {

                var existingRequisitionRecordInfo = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == existingRecord.RequisitionId && f.ReqTypeId == reqType);
                if (existingRequisitionRecordInfo != null)
                {
                    //existingRequisitionRecordInfo.LastWorkFlowStatus = existingRequisitionRecordInfo.WorkFlowStatus;
                    existingRequisitionRecordInfo.WorkFlowStatus = existingRequisitionRecordInfo.LastWorkFlowStatus;
                    _appDbContext.TblRequisitionOrders.Update(existingRequisitionRecordInfo);
                }
                _appDbContext.TblRequisitionScanHistories.Remove(existingRecord);

            }


            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                response.Message = "Request Proccessed Successfully...";
                response.HttpStatusCode = Status.Success;
                response.Status = "Success";
            }
            return response;


        }
        public DataQueryResponse<List<ScanHistoryResponse>> GetScanHistory(DataQueryModel<ScanHistoryQueryModel> query)
        {
            var response = new DataQueryResponse<List<ScanHistoryResponse>>();
            var tblRequisitionScanHistories = _appDbContext.TblRequisitionScanHistories.ToList();
            var facilityIds = tblRequisitionScanHistories.Select(x => x.FacilityId).Distinct().ToList();
            var tblFacilities = _appDbContext.TblFacilities.Where(w => facilityIds.Contains(w.FacilityId)).ToList();
            var userIds = tblRequisitionScanHistories.Select(x => x.CreatedBy).Distinct().ToList();
            var tblUsers = _masterDbContext.TblUsers.Where(w => userIds.Contains(w.Id)).ToList();

            #region Query
            var dataSource = (tblRequisitionScanHistories
                              .Select(s => new ScanHistoryResponse()
                              {
                                  Id = s.Id,
                                  RequisitionID = s.RequisitionId,
                                  SpecimenID = s.SpecimenId,
                                  FirstName = s.FirstName,
                                  LastName = s.LastName,
                                  DateOfBirth = s?.Dob != null ? Convert.ToDateTime(s?.Dob).ToString("MM-dd-yyyy") : null,
                                  DateOfCollection = s?.DateofCollection != null ? Convert.ToDateTime(s?.DateofCollection).ToString("MM-dd-yyyy") : null,
                                  TimeOfCollection = Convert.ToDateTime(s.DateofCollection).ToString("hh:mm:ss"),
                                  FacilityName = tblFacilities.FirstOrDefault(f => f.FacilityId == s.FacilityId)?.FacilityName,
                                  UpdatedDate = Convert.ToDateTime(s.CreatedDate).ToString("MM-dd-yyyy"),
                                  //UploadedTime = Convert.ToDateTime(s.UploadedDate).ToString("hh:mm:ss"),
                                  UpdatedBy = s.CreatedBy != null ? tblUsers.FirstOrDefault(f => f.Id == s.CreatedBy)?.FirstName != null ? tblUsers.FirstOrDefault(f => f.Id == s.CreatedBy)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == s.CreatedBy)?.LastName : s.CreatedBy : "",
                                  //Status = s.Status,
                              })).OrderByDescending(x => x.Id).ToList();
            #endregion
            response.Data = dataSource;

            #region Search
            if (!string.IsNullOrEmpty(query.QueryModel?.SpecimenID))
            {
                response.Data = response.Data.Where(w => w.SpecimenID != null && w.SpecimenID.Trim().ToLower().Contains(query.QueryModel?.SpecimenID.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.FirstName))
            {
                response.Data = response.Data.Where(w => w.FirstName != null && w.FirstName.Trim().ToLower().Contains(query.QueryModel?.FirstName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LastName))
            {
                response.Data = response.Data.Where(w => w.LastName != null && w.LastName.Trim().ToLower().Contains(query.QueryModel?.LastName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.DateOfBirth))
            {
                response.Data = response.Data.Where(w => w.DateOfBirth != null && w.DateOfBirth.Trim().ToLower().Contains(query.QueryModel?.DateOfBirth.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.DateOfCollection))
            {
                response.Data = response.Data.Where(w => w.DateOfCollection != null && w.DateOfCollection.Trim().ToLower().Contains(query.QueryModel?.DateOfCollection.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TimeOfCollection))
            {
                response.Data = response.Data.Where(w => w.TimeOfCollection != null && w.TimeOfCollection.Trim().ToLower().Contains(query.QueryModel?.TimeOfCollection.Trim().ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.FacilityName))
            {
                response.Data = response.Data.Where(w => w.FacilityName != null && w.FacilityName.Trim().ToLower().Contains(query.QueryModel?.FacilityName.Trim().ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.UpdatedBy))
            {
                response.Data = response.Data.Where(w => w.UpdatedBy != null && w.UpdatedBy.Trim().ToLower().Contains(query.QueryModel?.UpdatedBy.Trim().ToLower())).ToList();
            }

            response.Total = response.Data.Count;
            if (query.PageNumber > 0 && query.PageSize > 0)
                response.Data = response.Data.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();

            #endregion
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }
        public DataQueryResponse<List<PendingDataEntryResponse>> GetPendingDataEntry(DataQueryModel<PendingDataEntryQueryModel> query)
        {
            var response = new DataQueryResponse<List<PendingDataEntryResponse>>();
            var tblRequisitionMasters = _appDbContext.TblRequisitionMasters.Where(w => w.RequisitionStatus == 1  && w.IsDeleted == false).ToList();
            var tblRequisitionOrders = _appDbContext.TblRequisitionOrders.Where(w => w.WorkFlowStatus == "17" && w.IsDeleted == false).ToList();
            var tblRequisitionSpecimensInfos = _appDbContext.TblRequisitionSpecimensInfos.ToList();

            var facilityIds = tblRequisitionMasters.Select(x => x.FacilityId).Distinct().ToList();
            var tblFacilities = _appDbContext.TblFacilities.Where(w => facilityIds.Contains(w.FacilityId)).ToList();
            var physicianIds = tblRequisitionMasters.Select(x => x.PhysicianId).Distinct().ToList();
            var tblUsers = _masterDbContext.TblUsers.ToList();
            var tblRequisitionStatuses = _appDbContext.TblRequisitionStatuses.ToList();
            #region Query
            var dataSource = (from reqOrder in tblRequisitionOrders
                              join reqMaster in tblRequisitionMasters on reqOrder.RequisitionId equals reqMaster.RequisitionId
                               into reqMasterreqOrder
                              from reqMasterplusreqOrder in reqMasterreqOrder.DefaultIfEmpty()

                              join specimenInfo in tblRequisitionSpecimensInfos on reqOrder.RequisitionId equals specimenInfo.RequisitionId
                              into reqMasterspecimenInfo
                              from reqMasterplusspecimenInfo in reqMasterspecimenInfo.DefaultIfEmpty()
                              select new PendingDataEntryResponse()
                              {
                                  RequisitionOrderId = reqOrder?.RequisitionOrderId,
                                  RequisitionID = reqOrder?.RequisitionId,
                                  SpecimenID = reqMasterplusspecimenInfo?.SpecimenId,
                                  StatusId = reqMasterplusreqOrder?.RequisitionStatus,
                                  StatusName = reqMasterplusreqOrder?.RequisitionStatus != null ? tblRequisitionStatuses.FirstOrDefault(f => f.ReqStatusId == reqMasterplusreqOrder?.RequisitionStatus)?.Name : null,
                                  FirstName = reqMasterplusreqOrder?.FirstName,
                                  LastName = reqMasterplusreqOrder?.LastName,
                                  DateOfBirth = reqMasterplusreqOrder?.Dob != null ? Convert.ToDateTime(reqMasterplusreqOrder?.Dob).ToString("MM-dd-yyyy") : null,
                                  DateOfCollection = reqMasterplusreqOrder?.DateofCollection != null ? Convert.ToDateTime(reqMasterplusreqOrder?.DateofCollection).ToString("MM-dd-yyyy") : null,
                                  FacilityName = tblFacilities.FirstOrDefault(f => f.FacilityId == reqMasterplusreqOrder?.FacilityId)?.FacilityName,
                                  PhysicianName = string.IsNullOrEmpty(reqMasterplusreqOrder?.PhysicianId) ? tblUsers.FirstOrDefault(f => f.Id == reqMasterplusreqOrder?.PhysicianId)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == reqMasterplusreqOrder?.PhysicianId)?.LastName : null,
                                  UpdatedDate = Convert.ToDateTime(reqMasterplusreqOrder?.UpdatedDate).ToString("MM-dd-yyyy"),
                                  UpdatedBy = reqMasterplusreqOrder?.UpdatedBy != null ? tblUsers.FirstOrDefault(f => f.Id == reqMasterplusreqOrder.UpdatedBy)?.FirstName != null ? tblUsers.FirstOrDefault(f => f.Id == reqMasterplusreqOrder.UpdatedBy)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == reqMasterplusreqOrder.UpdatedBy)?.LastName : reqMasterplusreqOrder.UpdatedBy : ""

                              }
                               ).ToList();

            #endregion
            response.Data = dataSource;

            #region Search
            if (!string.IsNullOrEmpty(query.QueryModel?.SpecimenID))
            {
                response.Data = response.Data.Where(w => w.SpecimenID != null && w.SpecimenID.Trim().ToLower().Contains(query.QueryModel?.SpecimenID.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.FirstName))
            {
                response.Data = response.Data.Where(w => w.FirstName != null && w.FirstName.Trim().ToLower().Contains(query.QueryModel?.FirstName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LastName))
            {
                response.Data = response.Data.Where(w => w.LastName != null && w.LastName.Trim().ToLower().Contains(query.QueryModel?.LastName.Trim().ToLower())).ToList();
            }
            //if (!string.IsNullOrEmpty(query.QueryModel?.TimeOfCollection))
            //{
            //    response.Data = response.Data.Where(w => w.TimeOfCollection != null && w.TimeOfCollection.Trim().ToLower().Contains(query.QueryModel?.TimeOfCollection.Trim().ToLower())).ToList();
            //}
            if (!string.IsNullOrEmpty(query.QueryModel?.DateOfBirth))
            {
                response.Data = response.Data.Where(w => w.DateOfBirth != null && w.DateOfBirth.Trim().ToLower().Contains(query.QueryModel?.DateOfBirth.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.DateOfCollection))
            {
                response.Data = response.Data.Where(w => w.DateOfCollection != null && w.DateOfCollection.Trim().ToLower().Contains(query.QueryModel?.DateOfCollection.Trim().ToLower())).ToList();
            }



            if (!string.IsNullOrEmpty(query.QueryModel?.FacilityName))
            {
                response.Data = response.Data.Where(w => w.FacilityName != null && w.FacilityName.Trim().ToLower().Contains(query.QueryModel?.FacilityName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.PhysicianName))
            {
                response.Data = response.Data.Where(w => w.PhysicianName != null && w.PhysicianName.Trim().ToLower().Contains(query.QueryModel?.PhysicianName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.UpdatedBy))
            {
                response.Data = response.Data.Where(w => w.UpdatedBy != null && w.UpdatedBy.Trim().ToLower().Contains(query.QueryModel?.UpdatedBy.Trim().ToLower())).ToList();
            }

            response.Total = response.Data.Count;
            if (query.PageNumber > 0 && query.PageSize > 0)
                response.Data = response.Data.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();

            #endregion
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }

        public RequestResponse DeletePendingDataEntry(int id)
        {
            var response = new RequestResponse();


            var getRecordForSoftDelTable2 = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionOrderId == id);
            if (getRecordForSoftDelTable2 != null)
            {
                getRecordForSoftDelTable2.DeletedBy = LoggedInUser;
                getRecordForSoftDelTable2.DeletedDate = DateTime.UtcNow;
                //getRecordForSoftDelTable2 = 5;
                getRecordForSoftDelTable2.IsDeleted = true;
                _appDbContext.TblRequisitionOrders.Update(getRecordForSoftDelTable2);
            }
            else
            {
                response.Message = $"Record is not exist against ID : {id} in our system...";
                response.HttpStatusCode = Status.Success;

            }


            _appDbContext.SaveChanges();

            response.Message = "Request Proccessed Successfully...";
            response.HttpStatusCode = Status.Success;
            response.Data = getRecordForSoftDelTable2.RequisitionOrderId;

            return response;
        }

        //public async Task<RequestResponse> SavePrinterSetupAsync(PaperCheckInRequest request)
        //{
        //    var response = new RequestResponse();

        //    _appDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        //    var ReqMaster = new TblRequisitionMaster()
        //    {

        //    };


        //    var entity = new TblPrinterSetup();
        //    var facilities = new TblFacility();
        //    entity.Id = request.Id;
        //    entity.PrinterName = request.PrinterName;
        //    entity.BrandName = request.BrandName;
        //    entity.ModelNumber = request.ModelNumber;
        //    entity.LabelSize = request.LabelSize;
        //    entity.LabelType = request.LabelType;
        //    entity.LabId = request.LabId;
        //    entity.IsDeleted = false;
        //    if (entity.Id > 0)
        //    {
        //        var getRecordForEdit = await _appDbContext.TblPrinterSetups.FindAsync(entity.Id);
        //        if (getRecordForEdit != null)
        //        {

        //            _appDbContext.TblPrinterSetups.Update(entity);
        //            response.Message = "Record is Updated...";

        //        }
        //        else
        //        {
        //            response.Message = $"Record is not exist against ID : {entity.Id} in our system...";
        //            response.HttpStatusCode = Status.Success;
        //            //response.Status = "Failed !";
        //            //response.Message = "Request Failed !";
        //            return response;
        //        }
        //    }
        //    else
        //    {
        //        await _appDbContext.TblPrinterSetups.AddAsync(entity);
        //        response.Message = "Record is Added...";
        //    }

        //    var ack = await _appDbContext.SaveChangesAsync();
        //    if (ack > 0)
        //    {
        //        response.HttpStatusCode = Status.Success;
        //        //response.Message = "Success !";
        //    }
        //    return response;
        //}

        public dynamic GetPhysiciansLookup(int id)
        {
            //var response = new List<CommonLookupResponse>();
            var userIds = _appDbContext.TblFacilityUsers.Where(w => w.FacilityId == id).Select(w => w.UserId).ToList();
            // var users = _masterDbContext.TblUsers.Where(w => userIds.Contains(w.Id) && w.AdminType == "8").Select(s => new CommonLookupResponse() { Label = s.FirstName + " - " + s.LastName, Value = s.Id }).OrderBy(o => o.Label).ToListAsync();

            var tblUser = _masterDbContext.TblUsers.Where(u => userIds.Contains(u.Id) && u.AdminType == "8").Select(s => new
            {
                Label = $"{s.FirstName} {s.LastName}",
                Value = s.Id
            }).ToList();

            return tblUser;

        }


        public async Task<List<CommonLookupResponse>> RequisitionType_Lookup()
        {
            return await _lookupManager.RequisitionType_Lookup();
        }

        public async Task<RequestResponse<List<CommonLookupResponse>>> Insurance_Lookup()
        {
            var response = new RequestResponse<List<CommonLookupResponse>>();

            var lookupResponse = await _masterDbContext.TblInsuranceSetups.Select(s => new CommonLookupResponse() { Label = s.InsuranceName, Value = s.InsuranceId }).OrderBy(o => o.Label).ToListAsync();
            response.Data = lookupResponse;
            response.Message = "Request Proccessed Successfully...";
            response.HttpStatusCode = Status.Success;
            response.Status = "Success";
            return response;

        }
        public async Task<List<CommonLookupResponse>> Panel_Lookup(int reqTypeId)
        {
            var response = new List<CommonLookupResponse>();
            var LabId = _connectionManager.GetLabId();
            //var ReqType = _appDbContext.TblLabRequisitionTypes.FirstOrDefault(f => f.ReqTypeId == reqTypeId).RequisitionTypeName;
            var lookupResponse = await _appDbContext.TblCompendiumPanels.Where(w => w.ReqTypeId == reqTypeId).Select(s => new CommonLookupResponse() { Label = s.PanelName, Value = s.Id }).OrderBy(o => o.Label).ToListAsync();
            response = lookupResponse;

            return response;

        }

        //public class getPanelRequest
        //{
        //    public int ReqTypeId { get; set; }
        //    public int InsuranceId { get; set; }

        //}
    }
}
