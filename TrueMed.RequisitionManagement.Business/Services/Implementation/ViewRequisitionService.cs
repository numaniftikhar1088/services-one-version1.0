
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;
using Microsoft.Extensions.Configuration;
using System.Linq.Dynamic.Core;
using Dapper;
using System.Data;
using TrueMed.Domain.Models.Datatable;
using Newtonsoft.Json;
using Microsoft.FeatureManagement;
using TrueMed.Business.TenantDbContext;
using TrueMed.Business.MasterDBContext;
using System.Reflection;

namespace TrueMed.RequisitionManagement.Business.Services.Implementation
{
    public class ViewRequisitionService : IViewRequisitionService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext _appDbContext;
        private readonly MasterDbContext _masterDbContext;
        private readonly IBlobStorageManager _blobStorageManager;
        private readonly IConfiguration _configuration;
        private readonly IDapperManager _dapper;
        private readonly IFeatureManager _featureManager;

        public ViewRequisitionService(IConnectionManager connectionManager,
            MasterDbContext masterDbContext, IBlobStorageManager blobStorageManager, IConfiguration configuration, IDapperManager dapper, IFeatureManager featureManager)
        {
            _connectionManager = connectionManager;
            _masterDbContext = masterDbContext;
            _appDbContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);
            LoggedInUser = connectionManager.UserId;
            _blobStorageManager = blobStorageManager;
            _configuration = configuration;
            _dapper = dapper;
            _featureManager = featureManager;
        }
        public string LoggedInUser { get; set; }
        #region Queries
        public DataQueryResponse<List<ViewRequisitionResponse>> ViewRequisition(DynamicDataGridRequest<DynamicDataFilter> query)
        {

            var isenabled = _featureManager.IsEnabledAsync(_connectionManager.X_Portal_Key_Value + "_ViewRequisition").GetAwaiter().GetResult();

            int portalType = 1;
            #region PortalType
            var loggedInuserId = _connectionManager.UserId;
            var adminTypeId = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == loggedInuserId)?.AdminType;
            //var adminType = _masterDbContext.TblOptionLookups.FirstOrDefault(f => f.Id == Convert.ToInt32(adminTypeId))?.UserType;
            if (adminTypeId == "8")
            {
                portalType = 2;
            }
            #endregion
            #region Source
            var response = new DataQueryResponse<List<ViewRequisitionResponse>>();

            var param = new DynamicParameters();
            param.Add("@userId", loggedInuserId, DbType.String, ParameterDirection.Input);
            param.Add("@PageNumber", query.PageNumber, DbType.Int32, ParameterDirection.Input);
            param.Add("@PageSize", query.PageSize, DbType.Int32, ParameterDirection.Input);
            param.Add("@SortColumn", string.IsNullOrEmpty(query?.SortColumn) ? "RequisitionId" : query.SortColumn, DbType.String, ParameterDirection.Input);
            param.Add("@SortOrder", string.IsNullOrEmpty(query?.SortDirection) ? "desc" : query?.SortDirection, DbType.String, ParameterDirection.Input);
            param.Add("@TabId", query?.TabId, DbType.Int32, ParameterDirection.Input);
            param.Add("@FilterJson", query?.Filters == null || query?.Filters.Count == 0 ? "[]" : JsonConvert.SerializeObject(query?.Filters), DbType.String, ParameterDirection.Input);
            //param.Add("@P_CREATED_BY_USER_ID", request.Created_By_User_Id, DbType.Int32, ParameterDirection.Input);
            //var result = await _dapper.SP_Execute<ComplaintResponse>("[dbo].[GET_COMPLAINT_REQUEST_LIST]", param);
            var result = _dapper.SP_Execute<ViewRequisitionResponse>("[dbo].[sp_DynamicViewRequisitions]", param).GetAwaiter().GetResult().ToList();
            if (result.Count > 0)
            {

                var allAddedBy = result.Select(x => x.AddedBy).Distinct().ToList();
                var allPhysician = result.Select(x => x.PhysicianName).Distinct().ToList();
                var allInsurances = result.Where(x => !string.IsNullOrEmpty(x.InsuranceProvider)).Select(x => Convert.ToInt32(x.InsuranceProvider)).Distinct().ToList();
                var allLabs = result.Where(x => !string.IsNullOrEmpty(x.LabName)).Select(x => Convert.ToInt32(x.LabName)).Distinct().ToList();

                var allUsers = allAddedBy.Concat(allPhysician);



                var tblUsers = _masterDbContext.TblUsers.AsNoTracking().Where(x => allUsers.Contains(x.Id)).Select(s => new { s.Id, s.FirstName, s.LastName }).ToList();
                var tblLabs = _masterDbContext.TblLabs.AsNoTracking().Where(x => allLabs.Contains(x.LabId)).Select(s => new { s.LabId, s.DisplayName }).ToList();
                var tblInsuranceProviders = _masterDbContext.TblInsuranceProviders.AsNoTracking().Where(x => allInsurances.Contains(x.InsuranceProviderId)).Select(s => new { s.InsuranceProviderId, s.ProviderName }).ToList();





                foreach (var item in result)
                {
                    item.LabName = !string.IsNullOrEmpty(item.LabName) ? tblLabs.FirstOrDefault(f => f.LabId == Convert.ToInt32(item.LabName))?.DisplayName : "";
                    item.AddedBy = !string.IsNullOrEmpty(item.AddedBy) ? tblUsers.FirstOrDefault(f => f.Id == item.AddedBy)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == item.AddedBy)?.LastName : "";
                    item.PhysicianName = !string.IsNullOrEmpty(item.PhysicianName) ? tblUsers.FirstOrDefault(f => f.Id == item.PhysicianName)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == item.PhysicianName)?.LastName : "";
                    item.InsuranceProvider = !string.IsNullOrEmpty(item.InsuranceProvider) ? tblInsuranceProviders.FirstOrDefault(f => f.InsuranceProviderId == Convert.ToInt32(item.InsuranceProvider))?.ProviderName : "";
                }
                response.Data = result;
                response.Total = Convert.ToInt32(result[0].TotalCount);
                response.StatusCode = HttpStatusCode.OK;
            }
            else
            {
                response.Data = result;
                response.Total = 0;
                response.StatusCode = HttpStatusCode.OK;
            }

            #endregion


            return response;
        }
        #endregion
        #region Commands
        public RequestResponse StatusChanged(ViewRequisitionStatusChangedRequest request)
        {
            var response = new RequestResponse();

            foreach (var requisitionId in request.RequisitionIds)
            {
                var existingRecord = _appDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == requisitionId);
                if (existingRecord != null)
                {
                    existingRecord.RequisitionStatus = request.StatusId;
                    _appDbContext.TblRequisitionMasters.Update(existingRecord);
                }
            }
            //===================== workflow statuses=========================== 
            if (request.StatusId == 2)//======== on hold
            {
                foreach (var requisitionId in request.RequisitionIds)
                {
                    var existingRecord = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == requisitionId);
                    if (existingRecord != null)
                    {
                        existingRecord.LastWorkFlowStatus = existingRecord.WorkFlowStatus;
                        existingRecord.ActionReasons = request.ActionReasons;
                        existingRecord.WorkFlowStatus = "24";
                        _appDbContext.TblRequisitionOrders.Update(existingRecord);
                    }
                }
            }
            if (request.StatusId == 3)//======== completed
            {
                foreach (var requisitionId in request.RequisitionIds)
                {
                    var existingRecord = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == requisitionId);
                    if (existingRecord != null)
                    {
                        existingRecord.LastWorkFlowStatus = existingRecord.WorkFlowStatus;
                        existingRecord.ActionReasons = request.ActionReasons;
                        existingRecord.WorkFlowStatus = "26";
                        _appDbContext.TblRequisitionOrders.Update(existingRecord);
                    }
                }
            }
            if (request.StatusId == 4)//======== Rejected
            {
                foreach (var requisitionId in request.RequisitionIds)
                {
                    var existingRecord = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == requisitionId);
                    if (existingRecord != null)
                    {
                        existingRecord.LastWorkFlowStatus = existingRecord.WorkFlowStatus;
                        existingRecord.ActionReasons = request.ActionReasons;
                        existingRecord.WorkFlowStatus = "28";
                        _appDbContext.TblRequisitionOrders.Update(existingRecord);
                    }
                }
            }
            if (request.StatusId == 5)//======== Deleted
            {
                foreach (var requisitionId in request.RequisitionIds)
                {
                    var existingRecord = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == requisitionId);
                    if (existingRecord != null)
                    {
                        existingRecord.LastWorkFlowStatus = existingRecord.WorkFlowStatus;
                        existingRecord.ActionReasons = request.ActionReasons;
                        existingRecord.WorkFlowStatus = "29";
                        _appDbContext.TblRequisitionOrders.Update(existingRecord);
                    }
                }
            }
            //===================================================================
            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                response.Message = "Request Proccessed Successfully...";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }
        public RequestResponse RemoveViewRequisition(int id)
        {
            var response = new RequestResponse();

            //foreach (var Id in ids)
            //{
            //    var existingRecord = _appDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == Id);
            //    if (existingRecord != null)
            //    {
            //        existingRecord.DeletedBy = LoggedInUser;
            //        existingRecord.DeletedDate = DateTimeNow.Get;
            //        existingRecord.IsDeleted = true;
            //        _appDbContext.TblRequisitionMasters.Update(existingRecord);
            //    }
            //}
            //var ack = _appDbContext.SaveChanges();
            var getRecordForSoftDel = _appDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == id);
            if (getRecordForSoftDel != null)
            {
                getRecordForSoftDel.DeletedBy = _connectionManager.UserId;
                getRecordForSoftDel.DeletedDate = DateTimeNow.Get;
                //getRecordForSoftDel.RequisitionStatus = 5;
                getRecordForSoftDel.IsDeleted = true;
                _appDbContext.TblRequisitionMasters.Update(getRecordForSoftDel);
                var getRecordForSoftDelTable2 = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == id);
                if (getRecordForSoftDelTable2 != null)
                {
                    getRecordForSoftDelTable2.DeletedBy = _connectionManager.UserId;
                    getRecordForSoftDelTable2.DeletedDate = DateTimeNow.Get;
                    //getRecordForSoftDelTable2 = 5;
                    getRecordForSoftDelTable2.IsDeleted = true;
                    _appDbContext.TblRequisitionOrders.Update(getRecordForSoftDelTable2);
                }
                else
                {
                    response.Message = $"Record is not exist against ID : {id} in our system...";
                    response.HttpStatusCode = Status.Success;

                }
            }
            else
            {
                response.Message = $"Record is not exist against ID : {id} in our system...";
                response.HttpStatusCode = Status.Success;

            }
            var ack = _appDbContext.SaveChanges();

            if (ack > 0)
            {
                response.Message = "Request Proccessed Successfully...";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }

        #endregion
        public RequestResponse NextStepButton(updateNextStepStatus request)
        {
            var response = new RequestResponse();


            int portalType = 1;
            #region PortalType
            var loggedInuserId = _connectionManager.UserId;
            var adminTypeId = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == loggedInuserId)?.AdminType;
            //var adminType = _masterDbContext.TblOptionLookups.FirstOrDefault(f => f.Id == Convert.ToInt32(adminTypeId))?.UserType;
            if (adminTypeId == "8")
            {
                portalType = 2;
            }
            #endregion
            var existingRequisitionMaster = _appDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == request.RequisitionId);
            var existingRecordtbl1 = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == request.RequisitionId);
            if (existingRecordtbl1 != null)
            {
                var existingRecordtbl2 = _appDbContext.TblLabRequisitionTypeWorkflowStatuses.FirstOrDefault(f => f.ActionPerformed == request.NextStep && f.PortalTypeId == portalType && f.LabId == existingRecordtbl1.LabId && f.ReqTypeId == existingRecordtbl1.ReqTypeId && f.IsActive.Equals(true));
                if (existingRecordtbl2 != null)
                {

                    if (request.NextStep.Trim().ToLower().Replace(" ", "") == "removehold")
                    {
                        existingRecordtbl1.WorkFlowStatus = existingRecordtbl1.LastWorkFlowStatus;
                        if (existingRequisitionMaster != null)
                        {
                            existingRequisitionMaster.RequisitionStatus = 1;
                            _appDbContext.TblRequisitionMasters.Update(existingRequisitionMaster);
                        }

                    }
                    else
                    {
                        if (request.NextStep.Trim().ToLower().Replace(" ", "") == "uploadresult")
                        {
                            //existingRecordtbl1.Lisstatus = "2";
                            //================================================================================
                            //==========================Upload Blob ==========================================

                            var blobUrilst = new List<string>();
                            string fileName = "Result_" + request.RequisitionOrderId;
                            var azureblob = _blobStorageManager.UploadAsync(request.file, _connectionManager, fileName).GetAwaiter().GetResult(); ;
                            var ext = Path.GetExtension(request.file.FileName);
                            var obj = new UploadReqFileDetailRequest()
                            {
                                RequisitionId = request.RequisitionId,
                                RequisitionOrderId = request.RequisitionOrderId,
                                RequisitionType = request.RequisitionType,
                                FileName = fileName + ext,
                                FileUrl = azureblob.uri,
                                TypeOfFile = "Result"
                            };
                            UploadRequisitionFileDetail(obj);




                            //================================================================================
                            //================================================================================
                        }
                        existingRecordtbl1.LastWorkFlowStatus = existingRecordtbl1.WorkFlowStatus;
                        if (_connectionManager.IsFacilityUser)
                        {
                            existingRecordtbl1.WorkFlowStatus = existingRecordtbl2.NextWorkFlowIdforPhysician?.ToString();
                        }
                        else
                        {
                            existingRecordtbl1.WorkFlowStatus = existingRecordtbl2.NextWorkFlowIdforAdmin?.ToString();
                        }
                    }
                    _appDbContext.TblRequisitionOrders.Update(existingRecordtbl1);
                    #region========================================================= Check In
                    if (request.NextStep.Trim().ToLower().Replace(" ", "") == "checkin")
                    {
                        if (existingRequisitionMaster != null && existingRequisitionMaster.DateofCollection == null)
                        {
                            existingRequisitionMaster.DateofCollection = DateTimeNow.Get.Date;
                            existingRequisitionMaster.TimeofCollection = DateTimeNow.Get.TimeOfDay;
                            _appDbContext.TblRequisitionMasters.Update(existingRequisitionMaster);

                        }
                    }
                    #endregion===================================================== Check In

                    #region========================================================= Validate
                    if (request.NextStep.Trim().ToLower().Replace(" ", "") == "validate")
                    {
                        if (existingRecordtbl1 != null)
                        {
                            existingRecordtbl1.ValidationDate = DateTimeNow.Get;
                            existingRecordtbl1.Lisstatus = "3";
                            _appDbContext.TblRequisitionOrders.Update(existingRecordtbl1);

                        }
                    }
                    #endregion===================================================== Validate
                    #region========================================================= Processing
                    if (request.NextStep.Trim().ToLower().Replace(" ", "") == "processing")
                    {
                        if (existingRecordtbl1 != null)
                        {
                            existingRecordtbl1.Lisstatus = "1";
                            _appDbContext.TblRequisitionOrders.Update(existingRecordtbl1);

                        }
                    }
                    #endregion===================================================== Processing

                    #region========================================================= begin
                    if (request.NextStep.Trim().ToLower().Replace(" ", "") == "begin")
                    {
                        existingRecordtbl1.DateReceived = DateTime.UtcNow;
                        //    existingRecordtbl1.AccessionDate = DateTimeNow.Get;
                        //  existingRecordtbl1.AccessionBy = loggedInuserId;
                        //int max = _appDbContext.TblRequisitionOrders.Max(m => m.AccessionSequenceNumber) != null ? Convert.ToInt32(_appDbContext.TblRequisitionOrders.Max(m => m.AccessionSequenceNumber)) : 0;
                        //existingRecordtbl1.AccessionNumber = "ID-" + (max + 1);

                    }
                    _appDbContext.TblRequisitionOrders.Update(existingRecordtbl1);

                    #endregion===================================================== begin
                }
            }
            //===================================================================
            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                response.Message = "Request Proccessed Successfully...";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }

        public RequestResponse<FileContentResult> ViewRequisitionExportToExcel(ViewRequisitionExportToExcel request)
        {
            var response = new RequestResponse<FileContentResult>();

            #region PortalType
            int portalType = 1;
            var loggedInuserId = _connectionManager.UserId;
            var adminTypeId = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == loggedInuserId)?.AdminType;
            //var adminType = _masterDbContext.TblOptionLookups.FirstOrDefault(f => f.Id == Convert.ToInt32(adminTypeId))?.UserType;
            if (adminTypeId == "8")
            {
                portalType = 2;
            }
            #endregion

            #region Source
            var tblRequisitionMaster = _appDbContext.TblRequisitionMasters.Where(f => f.IsDeleted == false).ToList();
            var TblRequisitionOrders = _appDbContext.TblRequisitionOrders.ToList();
            var tblLabRequisitionType = _appDbContext.TblLabRequisitionTypes.ToList();
            var tblFacilities = _appDbContext.TblFacilities.ToList();
            var tblPatients = _appDbContext.TblPatientBasicInfos.ToList();
            var tblUsers = _masterDbContext.TblUsers.ToList();
            var tblRequisitionStatuses = _appDbContext.TblRequisitionStatuses.ToList();
            var tblWorkFlowStatuses = _appDbContext.TblWorkFlowStatuses.ToList();
            var tblRequisitionPatientInsurances = _appDbContext.TblRequisitionPatientInsurances.ToList();
            var tblLabRequisitionTypeWorkflowStatuses = _appDbContext.TblLabRequisitionTypeWorkflowStatuses.ToList();
            var tblFiles = _appDbContext.TblFiles.ToList();
            #endregion
            #region Query
            var data = (from Source_1 in tblRequisitionMaster
                        join Source_2 in tblFacilities on Source_1.FacilityId equals Source_2.FacilityId
                        into Combine_1
                        from Source_1_2 in Combine_1.DefaultIfEmpty()

                        join Source_3 in tblPatients on Source_1.PatientId equals Source_3.PatientId
                        into Combine_2
                        from Source_1_3 in Combine_2.DefaultIfEmpty()

                        join Source_4 in tblUsers on Source_1.PhysicianId equals Source_4.Id
                        into Combine_3
                        from Source_1_4 in Combine_3.DefaultIfEmpty()

                        join Source_5 in tblUsers on Source_1.CollectorId?.ToString() equals Source_5.Id
                        into Combine_4
                        from Source_1_5 in Combine_4.DefaultIfEmpty()

                        join Source_6 in TblRequisitionOrders on Source_1.RequisitionId equals Source_6.RequisitionId
                        into Combine_5
                        from Source_1_6 in Combine_5.DefaultIfEmpty()

                            //join Source_9 in tblLabRequisitionTypeWorkflowStatuses on Source_1_6.WorkFlowStatus equals Source_9.CurrentWorkFlowId
                            //into Combine_10
                            //from Source_Combine_10 in Combine_10.DefaultIfEmpty()

                        join Source_7 in tblRequisitionStatuses on Source_1.RequisitionStatus equals Source_7.ReqStatusId
                        into Combine_6
                        from Source_1_7 in Combine_6.DefaultIfEmpty()


                        join Source_8 in tblRequisitionPatientInsurances on Source_1.RequisitionId equals Source_8.RequisitionId
                        into Combine_7
                        from Source_1_8 in Combine_7.DefaultIfEmpty()

                        join Source_9 in tblFiles on Source_1.RequisitionId equals Source_9.ParentId
                        into Combine_8
                        from Source_1_9 in Combine_8.DefaultIfEmpty()

                        select new { ReqMaster = Source_1, Facility = Source_1_2, Patient = Source_1_3, Physician = Source_1_4, Collector = Source_1_5, ReqGroup = Source_1_6, ReqStatuses = Source_1_7, Insurance = Source_1_8, File = Source_1_9 }).Select(s => new ViewRequisitionResponse()
                        {
                            RequisitionId = Convert.ToInt32(s.ReqMaster?.RequisitionId),
                            Order = s.ReqMaster?.OrderNumber,
                            //StatusId = s.ReqMaster?.RequisitionStatus,
                            //StatusName = s.ReqStatuses?.Name,
                            //WorkFlowStatusId = s.ReqGroup != null ? s.ReqGroup.WorkFlowStatus != null ? Convert.ToInt32(s.ReqGroup?.WorkFlowStatus) : null : null,
                            //WorkFlowStatus = s.ReqGroup != null ? tblWorkFlowStatuses.FirstOrDefault(f => f.Id == Convert.ToInt32(s.ReqGroup?.WorkFlowStatus))?.WorkFlowDisplayName : null,
                            //WorkFlowStatusColor = s.ReqGroup != null ? tblWorkFlowStatuses.FirstOrDefault(f => f.Id == Convert.ToInt32(s.ReqGroup?.WorkFlowStatus))?.WorkFlowColorStatus : null,
                            NextStep = s.ReqGroup != null ? tblLabRequisitionTypeWorkflowStatuses.FirstOrDefault(f => f.CurrentWorkFlowId == Convert.ToInt32(s.ReqGroup?.WorkFlowStatus) && f.LabId == s.ReqGroup?.LabId && f.ReqTypeId == s.ReqGroup?.ReqTypeId && f.PortalTypeId == portalType && f.IsActive.Equals(true))?.ActionPerformed : null,
                            ResultFile = s.File != null ? tblFiles.FirstOrDefault(f => f.ChildId == s.ReqGroup?.RecordId)?.FilePath : "",
                            FirstName = s.ReqMaster?.FirstName,
                            LastName = s.ReqMaster?.LastName,
                            //DateOfBirth = s.ReqMaster?.Dob != null ? Convert.ToDateTime(s.ReqMaster?.Dob).ToString("MM/dd/yyyy") : null,
                            PatientID = s.Patient?.PatientId,
                            RequisitionType = (tblLabRequisitionType.FirstOrDefault(f => f.ReqTypeId == Convert.ToInt32(s.ReqGroup?.ReqTypeId))?.RequisitionType),
                            //LabCode = s.ReqGroup?.LabId != null ? _appDbContext.TblLabs.FirstOrDefault(f => f.LabId == s.ReqGroup.LabId)?.LaboratoryName : null,
                            DateOfCollection = Convert.ToDateTime(s.ReqMaster?.DateofCollection).ToString("MM/dd/yyyy"),
                            //TimeOfCollection = Convert.ToDateTime(s.ReqMaster?.DateofCollection).ToString("hh:mm:ss"),
                            PhysicianName = $"{s.Physician?.FirstName} {s.Physician?.LastName}",
                            FacilityId = s.Facility?.FacilityId,
                            //ClientName = s.Facility?.FacilityName,
                            //ReceiveDate = s.ReqGroup?.DateReceived != null ? Convert.ToDateTime(s.ReqGroup?.DateReceived).ToString("MM/dd/yyyy") : null,
                            InsuranceType = s.Insurance?.BillingType,
                            InsuranceProvider = s.Insurance != null ? _masterDbContext.TblInsuranceProviders.FirstOrDefault(f => f.InsuranceProviderId == s.Insurance.InsuranceProviderId)?.ProviderName : "",
                            AddedBy = s.ReqMaster != null ? tblUsers.FirstOrDefault(f => f.Id == s.ReqMaster.CreatedBy)?.FirstName != null ? tblUsers.FirstOrDefault(f => f.Id == s.ReqMaster.CreatedBy)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == s.ReqMaster.CreatedBy)?.LastName : s.ReqMaster?.CreatedBy : "",
                            AddedDate = s.ReqMaster?.CreatedDate != null ? Convert.ToDateTime(s.ReqGroup?.CreatedDate).ToString("MM/dd/yyyy") : null,
                            ValidateDate = s.ReqGroup?.ValidationDate != null ? Convert.ToDateTime(s.ReqGroup?.ValidationDate).ToString("MM/dd/yyyy") : null,
                            //AccessionedBy = s.ReqGroup != null ? _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == s.ReqGroup.AccessionBy)?.FirstName != null ? _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == s.ReqGroup.AccessionBy)?.FirstName + " " + _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == s.ReqGroup.AccessionBy)?.LastName : s.ReqGroup.AccessionBy : "",
                            //AccesionedDate = s.ReqGroup?.AccessionDate != null ? Convert.ToDateTime(s.ReqGroup?.AccessionDate).ToString("MM/dd/yyyy") : null
                        }).OrderByDescending(x => x.RequisitionId).DistinctBy(d => d.RequisitionId).ToList();

            if (request.selectedRow?.Count() > 0)
            {
                data = data.Where(f => request.selectedRow.Contains(f.RequisitionId)).ToList();
            }
            else if (request.tabId == 1)
            {
                data = data.Where(f => f.RequisitionStatus?.Trim().ToLower() == "Open".ToLower()).ToList();
            }
            else if (request.tabId == 2)
            {
                data = data.Where(f => f.RequisitionStatus?.Trim().ToLower() == "On Hold".ToLower()).ToList();
            }
            else if (request.tabId == 3)
            {
                data = data.Where(f => f.RequisitionStatus?.Trim().ToLower() == "Completed".ToLower()).ToList();
            }
            else if (request.tabId == 4)
            {
                data = data.Where(f => f.RequisitionStatus?.Trim().ToLower() == "Rejected".ToLower()).ToList();
            }
            else if (request.tabId == 5)
            {
                data = data.Where(f => f.RequisitionStatus?.Trim().ToLower() == "Deleted".ToLower()).ToList();
            }
            #endregion

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Panel Reporting Rule");

            #region Header And Header Styling
            worksheet.Row(1).Style.Fill.PatternType = ExcelFillStyle.Solid;
            worksheet.Row(1).Style.Font.Bold = true;
            worksheet.Row(1).Style.Font.Color.SetColor(Color.White);
            worksheet.Row(1).Style.Fill.BackgroundColor.SetColor(Color.Black);


            worksheet.Cells[1, 1].Value = "Order";
            worksheet.Cells[1, 2].Value = "Status";
            worksheet.Cells[1, 3].Value = "First Name";
            worksheet.Cells[1, 4].Value = "Last Name";
            worksheet.Cells[1, 5].Value = "Date Of Birth";
            worksheet.Cells[1, 6].Value = "Patient ID";
            worksheet.Cells[1, 7].Value = "RequisitionType";
            worksheet.Cells[1, 8].Value = "Lab Code";
            worksheet.Cells[1, 9].Value = "Date Of Collection";
            worksheet.Cells[1, 10].Value = "Time Of Collection";
            worksheet.Cells[1, 11].Value = "Physician Name";
            worksheet.Cells[1, 12].Value = "Client Name";
            worksheet.Cells[1, 13].Value = "Receive Date";
            worksheet.Cells[1, 14].Value = "Insurance Type";
            worksheet.Cells[1, 15].Value = "Insurance Provider";
            worksheet.Cells[1, 16].Value = "Added By";
            worksheet.Cells[1, 17].Value = "Added Date";
            worksheet.Cells[1, 18].Value = "Validate Date";
            //worksheet.Cells[1, 19].Value = "Accessioned By";
            //worksheet.Cells[1, 20].Value = "Accesioned Date";

            #endregion
            #region Add data to the worksheet
            for (var i = 0; i < data.Count(); i++)
            {
                var row = i + 2;
                worksheet.Cells[row, 1].Value = data[i].Order;
                //worksheet.Cells[row, 2].Value = data[i].WorkFlowStatus;
                worksheet.Cells[row, 3].Value = data[i].FirstName;
                worksheet.Cells[row, 4].Value = data[i].LastName;
                //worksheet.Cells[row, 5].Value = data[i].DateOfBirth;
                worksheet.Cells[row, 6].Value = data[i].PatientID;
                worksheet.Cells[row, 7].Value = data[i].RequisitionType;
                //worksheet.Cells[row, 8].Value = data[i].LabCode;
                worksheet.Cells[row, 9].Value = data[i].DateOfCollection;
                worksheet.Cells[row, 10].Value = data[i].TimeOfCollection;
                worksheet.Cells[row, 11].Value = data[i].PhysicianName;
                //worksheet.Cells[row, 12].Value = data[i].ClientName;
                //worksheet.Cells[row, 13].Value = data[i].ReceiveDate;
                worksheet.Cells[row, 14].Value = data[i].InsuranceType;
                worksheet.Cells[row, 15].Value = data[i].InsuranceProvider;
                worksheet.Cells[row, 16].Value = data[i].AddedBy;
                worksheet.Cells[row, 17].Value = data[i].AddedDate;
                worksheet.Cells[row, 18].Value = data[i].ValidateDate;
                //worksheet.Cells[row, 19].Value = data[i].AccessionedBy;
                //worksheet.Cells[row, 20].Value = data[i].AccesionedDate;

            }

            // Set the column widths
            worksheet.Column(1).AutoFit();
            worksheet.Column(2).AutoFit();
            worksheet.Column(3).AutoFit();
            worksheet.Column(4).AutoFit();
            worksheet.Column(5).AutoFit();
            worksheet.Column(6).AutoFit();
            worksheet.Column(7).AutoFit();
            worksheet.Column(8).AutoFit();
            worksheet.Column(9).AutoFit();
            worksheet.Column(10).AutoFit();
            worksheet.Column(11).AutoFit();
            worksheet.Column(12).AutoFit();
            worksheet.Column(13).AutoFit();
            worksheet.Column(14).AutoFit();
            worksheet.Column(15).AutoFit();
            worksheet.Column(16).AutoFit();
            worksheet.Column(17).AutoFit();
            worksheet.Column(18).AutoFit();
            //worksheet.Column(19).AutoFit();
            //worksheet.Column(20).AutoFit();

            #endregion

            response.Data = new FileContentResult(package.GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed Successfully";


            return response;
        }

        public RequestResponse<FileContentResult> ViewRequisitionExportToExcelV2(DynamicDataGridRequest<DynamicDataFilter> request)
        {
            var response = new RequestResponse<FileContentResult>();


            var isenabled = _featureManager.IsEnabledAsync(_connectionManager.X_Portal_Key_Value + "_ViewRequisition").GetAwaiter().GetResult();

            int portalType = 1;
            #region PortalType
            var loggedInuserId = _connectionManager.UserId;
            var adminTypeId = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == loggedInuserId)?.AdminType;
            //var adminType = _masterDbContext.TblOptionLookups.FirstOrDefault(f => f.Id == Convert.ToInt32(adminTypeId))?.UserType;
            if (adminTypeId == "8")
            {
                portalType = 2;
            }
            #endregion
            #region Source
            //var response = new DataQueryResponse<List<ViewRequisitionResponse>>();

            var param = new DynamicParameters();
            param.Add("@userId", loggedInuserId, DbType.String, ParameterDirection.Input);
            param.Add("@PageNumber", request.PageNumber, DbType.Int32, ParameterDirection.Input);
            param.Add("@PageSize", request.PageSize, DbType.Int32, ParameterDirection.Input);
            param.Add("@SortColumn", string.IsNullOrEmpty(request?.SortColumn) ? "RequisitionId" : request.SortColumn, DbType.String, ParameterDirection.Input);
            param.Add("@SortOrder", string.IsNullOrEmpty(request?.SortDirection) ? "desc" : request?.SortDirection, DbType.String, ParameterDirection.Input);
            param.Add("@TabId", request?.TabId, DbType.Int32, ParameterDirection.Input);
            param.Add("@FilterJson", request?.Filters == null || request?.Filters.Count == 0 ? "[]" : JsonConvert.SerializeObject(request?.Filters), DbType.String, ParameterDirection.Input);
            //param.Add("@P_CREATED_BY_USER_ID", request.Created_By_User_Id, DbType.Int32, ParameterDirection.Input);
            //var result = await _dapper.SP_Execute<ComplaintResponse>("[dbo].[GET_COMPLAINT_REQUEST_LIST]", param);
            var data = _dapper.SP_Execute<ViewRequisitionResponse>("[dbo].[sp_DynamicViewRequisitions]", param).GetAwaiter().GetResult().ToList();
            if (data.Count > 0)
            {

                var allAddedBy = data.Select(x => x.AddedBy).Distinct().ToList();
                var allPhysician = data.Select(x => x.PhysicianName).Distinct().ToList();
                var allInsurances = data.Where(x => !string.IsNullOrEmpty(x.InsuranceProvider)).Select(x => Convert.ToInt32(x.InsuranceProvider)).Distinct().ToList();
                var allLabs = data.Where(x => !string.IsNullOrEmpty(x.LabName)).Select(x => Convert.ToInt32(x.LabName)).Distinct().ToList();

                var allUsers = allAddedBy.Concat(allPhysician);



                var tblUsers = _masterDbContext.TblUsers.AsNoTracking().Where(x => allUsers.Contains(x.Id)).Select(s => new { s.Id, s.FirstName, s.LastName }).ToList();
                var tblLabs = _masterDbContext.TblLabs.AsNoTracking().Where(x => allLabs.Contains(x.LabId)).Select(s => new { s.LabId, s.DisplayName }).ToList();
                var tblInsuranceProviders = _masterDbContext.TblInsuranceProviders.AsNoTracking().Where(x => allInsurances.Contains(x.InsuranceProviderId)).Select(s => new { s.InsuranceProviderId, s.ProviderName }).ToList();





                foreach (var item in data)
                {
                    item.LabName = !string.IsNullOrEmpty(item.LabName) ? tblLabs.FirstOrDefault(f => f.LabId == Convert.ToInt32(item.LabName))?.DisplayName : "";
                    item.AddedBy = !string.IsNullOrEmpty(item.AddedBy) ? tblUsers.FirstOrDefault(f => f.Id == item.AddedBy)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == item.AddedBy)?.LastName : "";
                    item.PhysicianName = !string.IsNullOrEmpty(item.PhysicianName) ? tblUsers.FirstOrDefault(f => f.Id == item.PhysicianName)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == item.PhysicianName)?.LastName : "";
                    item.InsuranceProvider = !string.IsNullOrEmpty(item.InsuranceProvider) ? tblInsuranceProviders.FirstOrDefault(f => f.InsuranceProviderId == Convert.ToInt32(item.InsuranceProvider))?.ProviderName : "";
                }

            }
            if (request.selectedRow?.Count() > 0)
            {
                data = data.Where(f => request.selectedRow.Contains(f.RequisitionId)).ToList();
            }
            #endregion source
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Panel Reporting Rule");

            #region Header And Header Styling
            worksheet.Row(1).Style.Fill.PatternType = ExcelFillStyle.Solid;
            worksheet.Row(1).Style.Font.Bold = true;
            worksheet.Row(1).Style.Font.Color.SetColor(Color.White);
            worksheet.Row(1).Style.Fill.BackgroundColor.SetColor(Color.Black);

            var columns = GetColumns();

            columns.Data.RemoveAll(w => w.ColumnLabel.Trim().ToLower() == "flag");
            columns.Data.RemoveAll(w => w.ColumnLabel.Trim().ToLower() == "print label");
            columns.Data.RemoveAll(w => w.ColumnLabel.Trim().ToLower() == "result file");
            columns.Data.RemoveAll(w => w.ColumnLabel.Trim().ToLower() == "next step");
            int cellValue = 1;
            foreach(var column in columns.Data)
            {
                if(column.IsShow == true && column.IsShowOnUi == true)
                {
                    worksheet.Cells[1, cellValue].Value = column.ColumnLabel;
                    cellValue++;
                }

            }

            #endregion
            var showedColumns = columns.Data.Where(w => w.IsShow.Equals(true) && w.IsShowOnUi.Equals(true)).ToList();
            #region Add data to the worksheet
            //var showedColumns = columns.Data.Where(w => w.IsShow.Equals(true) && w.IsShowOnUi.Equals(true)).ToList();
            for (var i = 0; i < data.Count(); i++)
            {
                var row = i + 2;
                int columnValue = 1;
                foreach (var column in showedColumns)
                {
                    // Assuming properties in ViewRequisitionResponse match the ExcelColumn properties

                    var propertyName = column.ColumnValue; // Assuming ColumnValue is the property name
                    var propertyInfo = data[i].GetType().GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

                    if (propertyInfo != null)
                    {
                        var propertyValue = propertyInfo.GetValue(data[i], null);
                        worksheet.Cells[row, columnValue].Value = propertyValue?.ToString();
                    }
                    else
                    {
                        // Handle the case where the property is not found
                        worksheet.Cells[row, columnValue].Value = null;
                    }

                    columnValue++;

                    //var propertyValue = data[i].GetType().GetProperty(column.ColumnValue.ToLower())?.GetValue(data[i]?.ToString()?.ToLower(), null);
                    //worksheet.Cells[row, columnValue].Value = propertyValue;
                    //columnValue++;
                }
            }
            //for (var i = 0; i < data.Count(); i++)
            //{
            //    var row = i + 2;
            //    worksheet.Cells[row, 1].Value = data[i].Order;
            //    //worksheet.Cells[row, 2].Value = data[i].WorkFlowStatus;
            //    worksheet.Cells[row, 3].Value = data[i].FirstName;
            //    worksheet.Cells[row, 4].Value = data[i].LastName;
            //    //worksheet.Cells[row, 5].Value = data[i].DateOfBirth;
            //    worksheet.Cells[row, 6].Value = data[i].PatientID;
            //    worksheet.Cells[row, 7].Value = data[i].RequisitionType;
            //    //worksheet.Cells[row, 8].Value = data[i].LabCode;
            //    worksheet.Cells[row, 9].Value = data[i].DateOfCollection;
            //    worksheet.Cells[row, 10].Value = data[i].TimeOfCollection;
            //    worksheet.Cells[row, 11].Value = data[i].PhysicianName;
            //    //worksheet.Cells[row, 12].Value = data[i].ClientName;
            //    //worksheet.Cells[row, 13].Value = data[i].ReceiveDate;
            //    worksheet.Cells[row, 14].Value = data[i].InsuranceType;
            //    worksheet.Cells[row, 15].Value = data[i].InsuranceProvider;
            //    worksheet.Cells[row, 16].Value = data[i].AddedBy;
            //    worksheet.Cells[row, 17].Value = data[i].AddedDate;
            //    worksheet.Cells[row, 18].Value = data[i].ValidateDate;
            //    //worksheet.Cells[row, 19].Value = data[i].AccessionedBy;
            //    //worksheet.Cells[row, 20].Value = data[i].AccesionedDate;

            //}

            // Set the column widths
            worksheet.Column(1).AutoFit();
            worksheet.Column(2).AutoFit();
            worksheet.Column(3).AutoFit();
            worksheet.Column(4).AutoFit();
            worksheet.Column(5).AutoFit();
            worksheet.Column(6).AutoFit();
            worksheet.Column(7).AutoFit();
            worksheet.Column(8).AutoFit();
            worksheet.Column(9).AutoFit();
            worksheet.Column(10).AutoFit();
            worksheet.Column(11).AutoFit();
            worksheet.Column(12).AutoFit();
            worksheet.Column(13).AutoFit();
            worksheet.Column(14).AutoFit();
            worksheet.Column(15).AutoFit();
            worksheet.Column(16).AutoFit();
            worksheet.Column(17).AutoFit();
            worksheet.Column(18).AutoFit();
            //worksheet.Column(19).AutoFit();
            //worksheet.Column(20).AutoFit();

            #endregion

            response.Data = new FileContentResult(package.GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed Successfully";


            return response;
        }


        public RequestResponse Restore(int id)
        {
            var response = new RequestResponse();

            var existingRecord = _appDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == id);
            if (existingRecord != null)
            {
                existingRecord.RequisitionStatus = 1;
                _appDbContext.TblRequisitionMasters.Update(existingRecord);
            }

            var existingRequisitionRecordInfo = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == id);
            if (existingRequisitionRecordInfo != null)
            {
                //existingRequisitionRecordInfo.LastWorkFlowStatus = existingRequisitionRecordInfo.WorkFlowStatus;
                existingRequisitionRecordInfo.WorkFlowStatus = existingRequisitionRecordInfo.LastWorkFlowStatus;
                _appDbContext.TblRequisitionOrders.Update(existingRequisitionRecordInfo);
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
        public RequestResponse GetPrintersInfo()
        {
            var response = new RequestResponse();

            var labId = _connectionManager.GetLabId();
            var defaultPrinter = _appDbContext.TblPrinterSetups.FirstOrDefault(f => f.LabId == labId && f.IsDefault.Equals(true));
            var dataSource = _appDbContext.TblPrinterSetups.Where(f => f.IsDeleted == false && f.LabId == labId)
                .Select(s => new ViewRequisitionPrinterInfoResp()
                {
                    Label = s.PrinterName,
                    Value = s.Id,
                    isDefault = defaultPrinter != null ? (s.Id == defaultPrinter.Id) ? true : false : false
                }).ToList();

            response.Data = dataSource;
            response.HttpStatusCode = Status.Success;
            response.Status = "Success";
            response.Message = "Request Processed...";
            return response;

        }

        public async Task<RequestResponse> UploadFile(ViewRequisitionUploadFileRequest request)
        {
            var tblFile = new TblFile();
            //var extension = Path.GetExtension(request.File.FileName);
            //var uniqueFileName = $"{Path.GetFileNameWithoutExtension(request.File.FileName)}_{Guid.NewGuid()}.{extension}";
            //var blobResponse = await _blobStorageManager.UploadAsync("ViewRequisitionResultFiles".ToLower(), uniqueFileName, request.File);
            var existingRecord = _appDbContext.TblFiles.FirstOrDefault(f => f.ParentId == request.RequisitionId && f.ChildId == request.RecordId && f.FacilityId == request.FacilityId);
            if (existingRecord != null)
            {
                existingRecord.Name = request.FileName;
                existingRecord.ContentType = request.ContentType;
                existingRecord.CreateDate = DateTimeNow.Get;
                existingRecord.FilePath = request.FilePath;
                existingRecord.Length = request.FileLength;
                existingRecord.IsDeleted = false;
                existingRecord.FacilityId = Convert.ToInt32(request.FacilityId);
                existingRecord.ChildId = request.RecordId;
                existingRecord.ParentId = request.RequisitionId;
                existingRecord.LabId = Convert.ToInt32(_connectionManager.GetLabId());
                existingRecord.CreatedBy = LoggedInUser;
                //existingRecord.DeletedDate = DateTimeNow.Get;
                existingRecord.FileType = "Result File";
                _appDbContext.TblFiles.Update(existingRecord);
            }
            else
            {
                if (request.FilePath != "")
                {
                    tblFile.Name = request.FileName;
                    tblFile.ContentType = request.ContentType;
                    tblFile.CreateDate = DateTimeNow.Get;
                    tblFile.FilePath = request.FilePath;
                    tblFile.Length = request.FileLength;
                    tblFile.IsDeleted = false;
                    tblFile.FacilityId = Convert.ToInt32(request.FacilityId);
                    tblFile.ChildId = request.RecordId;
                    tblFile.ParentId = request.RequisitionId;
                    tblFile.LabId = Convert.ToInt32(_connectionManager.GetLabId());
                    tblFile.CreatedBy = LoggedInUser;
                    //tblFile.DeletedDate = DateTimeNow.Get;
                    tblFile.FileType = "Result File";
                    await _appDbContext.TblFiles.AddAsync(tblFile);
                }
            }

            await _appDbContext.SaveChangesAsync();

            updateNextStepStatus req = new updateNextStepStatus();
            req.NextStep = "UploadResult";
            req.RequisitionId = request.RequisitionId;
            var res = NextStepButton(req);

            //var ack = await _appDbContext.SaveChangesAsync();
            //    if (ack > 0)
            //    {
            //        response.Message = "Files Uploads Successfully...";
            //        response.HttpStatusCode = Status.Success;
            //    }
            return res;
        }

        //public async Task<RequestResponse> DownloadFile(int requisitionId)
        //{
        //    var filePath = _appDbContext.TblFiles.FirstOrDefault(f => f.ChildId == requisitionId)?.FilePath;
        //    BlobDownloadModel model = new BlobDownloadModel();
        //    if (filePath == null)
        //    {
        //        _httpClient.PostAsync("https://tmpoapigetwayscus-dev.azurewebsites.net/File/DownloadBlob",  );

        //    }
        //}

        public RequestResponse<List<ViewRequisitionColumnsResponse>> GetColumns()
        {
            var response = new RequestResponse<List<ViewRequisitionColumnsResponse>>();
            var tblViewRequisitionColumns = _appDbContext.TblViewRequisitionColumns.ToList();
            var tblUserViewRequisitions = _appDbContext.TblUserViewRequisitions.Where(w => w.UserId == LoggedInUser).Select(s => s.ViewRequisitionId).ToList();

            //var list = new List<ViewRequisitionColumnsResponse>();
            //foreach (var record in tblViewRequisitionColumns)
            //{
            //    var viewRequisitionColumnsResponse = new ViewRequisitionColumnsResponse
            //    {
            //        Id = record.Id,
            //        ColumnLabel = record.ColumnLabel,
            //        ColumnName = record.ColumnName,
            //        IsShow = tblUserViewRequisitions.Any(m => m.ViewRequisitionId == record.Id) || tblUserViewRequisitions.Count == 0 // Check if record.Id is present in matchedRecords
            //    };

            //    list.Add(viewRequisitionColumnsResponse);
            //}
            if (tblUserViewRequisitions.Count() > 0)
            {
                var orderedColumns = tblUserViewRequisitions
                               .Join(
                                   tblViewRequisitionColumns,
                                   uvr => uvr.Value,
                                   column => column.Id,
                                   (uvr, column) => new ViewRequisitionColumnsResponse
                                   {
                                       Id = column.Id,
                                       ColumnLabel = column.ColumnLabel,
                                       ColumnName = column.ColumnName,
                                       ColumnValue = column.ColumnValue,
                                       IsShowOnUi = column.IsShowOnUi,
                                       IsShow = true,
                                       FilterColumns = column.FilterColumns,
                                       FilterColumnsType = column.FilterColumnsType,
                                   })
                               .ToList();

                // Now, we need to include columns that are in TblViewRequisitionColumns but not in TblUserViewRequisitions
                var remainingColumns = _appDbContext.TblViewRequisitionColumns
                    .Where(column => !tblUserViewRequisitions.Contains(column.Id))
                    .Select(column => new ViewRequisitionColumnsResponse
                    {
                        Id = column.Id,
                        ColumnLabel = column.ColumnLabel,
                        ColumnName = column.ColumnName,
                        ColumnValue = column.ColumnValue,
                        IsShowOnUi = column.IsShowOnUi,
                        IsShow = false,
                        FilterColumns = column.FilterColumns,
                        FilterColumnsType = column.FilterColumnsType,
                    })
                    .ToList();

                // Combine the ordered columns and the remaining columns
                orderedColumns.AddRange(remainingColumns);

                response.Data = orderedColumns;
            }
            else
            {
                var list = new List<ViewRequisitionColumnsResponse>();
                foreach (var item in tblViewRequisitionColumns)
                {
                    var obj = new ViewRequisitionColumnsResponse()
                    {
                        Id = item.Id,
                        ColumnLabel = item.ColumnLabel,
                        ColumnName = item.ColumnName,
                        ColumnValue = item.ColumnValue,
                        IsShowOnUi = item.IsShowOnUi,
                        IsShow = true,
                        FilterColumns = item.FilterColumns,
                        FilterColumnsType = item.FilterColumnsType,
                    };
                    list.Add(obj);
                }
                response.Data = list;
            }



            //response.Data = list;
            response.HttpStatusCode = Status.Success;
            response.Status = "Success..";
            response.Message = "Request Successfully processed.";
            return response;
        }
        public RequestResponse SaveColumns(List<ViewRequisitionColumnsResponse> request)
        {
            RequestResponse response = new RequestResponse();
            List<TblUserViewRequisition> list = new List<TblUserViewRequisition>();

            foreach (var column in request)
            {
                if (column.IsShow == true)
                {
                    TblUserViewRequisition temp = new TblUserViewRequisition();
                    temp.UserId = LoggedInUser;
                    temp.LabId = _connectionManager.GetLabId();
                    temp.ViewRequisitionId = column.Id;
                    // Don't set the Id property here, SQL Server will generate it automatically
                    list.Add(temp);
                }
            }

            // Remove existing records for the user
            var getRecordForEdit = _appDbContext.TblUserViewRequisitions
                .Where(x => x.UserId == LoggedInUser)
                .ToList();

            if (getRecordForEdit.Count() != 0)
            {
                _appDbContext.TblUserViewRequisitions.RemoveRange(getRecordForEdit);
                _appDbContext.SaveChanges();
            }

            // Add the new records
            if (list.Count > 0)
            {
                _appDbContext.TblUserViewRequisitions.AddRange(list);
                _appDbContext.SaveChanges();
            }

            response.HttpStatusCode = Status.Success;
            response.Status = "Success...";
            response.Message = "Request Successfully processed";

            return response;
        }

        public RequestResponse UploadRequisitionFileDetail(UploadReqFileDetailRequest request)
        {
            var response = new RequestResponse();
            var existing = _appDbContext.TblRequisitionFiles.FirstOrDefault(f => f.RequisitionId == request.RequisitionId && f.RequisitionOrderId == request.RequisitionOrderId && f.RequisitionType == request.RequisitionType && f.IsDeleted.Equals(false));
            if (existing != null)
            {
                existing.DeletedBy = LoggedInUser;
                existing.DeletedDate = DateTime.UtcNow;
                existing.IsDeleted = true;
                _appDbContext.TblRequisitionFiles.Update(existing);
            }
            var obj = new TblRequisitionFile()
            {
                RequisitionId = request.RequisitionId,
                RequisitionOrderId = request.RequisitionOrderId,
                RequisitionType = request.RequisitionType,
                FileName = request.FileName,
                FileUrl = request.FileUrl,
                TypeOfFile = request.TypeOfFile,
                CreatedBy = LoggedInUser,
                CreatedDate = DateTime.UtcNow,
                SystemGenerated = false,
                IsDeleted = false
            };
            _appDbContext.TblRequisitionFiles.Add(obj);

            var ack = _appDbContext.SaveChanges();
            if (ack < 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success...";
                response.Message = "Request Successfully processed";
            }
            return response;
        }

        public RequestResponse GetTabsConfiguration(int PageId)
        {
            var param = new DynamicParameters();
            param.Add("@userId", _connectionManager.UserId, DbType.String, ParameterDirection.Input);
            param.Add("@pageId", PageId, DbType.Int32, ParameterDirection.Input);

            //param.Add("@P_CREATED_BY_USER_ID", request.Created_By_User_Id, DbType.Int32, ParameterDirection.Input);
            //var result = await _dapper.SP_Execute<ComplaintResponse>("[dbo].[GET_COMPLAINT_REQUEST_LIST]", param);
            var result = _dapper.SP_Execute<ViewReqTabsWithHeadersStoreProcedureResponse>("[dbo].[sp_GetColumnHeadersForViewRequisitionTabs]", param).GetAwaiter().GetResult().ToList();

            var finalResp = new List<ViewReqTabsWithHeadersResponse>();
            var distictResult = result.Select(x => new { x.TabID, x.TabName }).Distinct().ToList();

            foreach (var item in distictResult)
            {
                var a = new ViewReqTabsWithHeadersResponse();
                a.TabID = item.TabID;
                a.TabName = item.TabName;
                a.TabHeaders = new List<TabHeader>();
                a.TabHeaders = result.Where(x => x.TabID == item.TabID).Select(x => new TabHeader()
                {
                    ColumnLabel = x.ColumnLabel,
                    FilterColumns = x.FilterColumns,
                    FilterColumnsType = x.FilterColumnsType,
                    IsShowOnUI = x.IsShowOnUI,
                    ColumnKey = x.ColumnKey


                }).ToList();
                finalResp.Add(a);

            }



            var resp = new RequestResponse();
            resp.Message = "Success";
            resp.HttpStatusCode = Status.Success;
            resp.Status = Status.Success.ToString();
            resp.Data = finalResp;


            return resp;


        }
    }
}
