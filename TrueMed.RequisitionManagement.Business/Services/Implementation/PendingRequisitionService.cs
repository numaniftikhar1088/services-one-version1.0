using Azure;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml.Style;
using OfficeOpenXml;
using System.Drawing;
using System.Linq.Dynamic.Core;
using System.Net;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Business.Interface;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;
using TrueMed.Business.TenantDbContext;
using TrueMed.Business.MasterDBContext;

namespace TrueMed.RequisitionManagement.Business.Services.Implementation
{
    public class PendingRequisitionService : IPendingRequisitionService
    {
        private readonly IConnectionManager _connectionManager;

        private ApplicationDbContext _appDbContext;
        private MasterDbContext _masterDbContext;

        public PendingRequisitionService(IConnectionManager connectionManager, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _appDbContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);
            _masterDbContext = masterDbContext;
        }

        public DataQueryResponse<List<IncompleteRequisitionResponse>> IncompleteRequisition(DataQueryModel<IncompleteRequisitionQM> query)
        {
            var response = new DataQueryResponse<List<IncompleteRequisitionResponse>>();

            var requisitionStatusIds = new List<int?>() {1,2};
            var requisitionMasters = _appDbContext.TblRequisitionMasters.Where(w => w.MissingColumns != null && w.IsDeleted == false && requisitionStatusIds.Contains(w.RequisitionStatus)).ToList();

            response.Data = new();
            foreach (var requisitionMaster in requisitionMasters)
            {
                var IncompleteRequisitionObj = new IncompleteRequisitionResponse();

                var facilityName = _appDbContext.TblFacilities.FirstOrDefault(f => f.FacilityId == requisitionMaster.FacilityId)?.FacilityName;
                var workFlowStatusId = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == requisitionMaster.RequisitionId)?.WorkFlowStatus;
                var workFlowStatus = _appDbContext.TblWorkFlowStatuses.FirstOrDefault(f => f.Id == (workFlowStatusId!=null ? int.Parse(workFlowStatusId):0))?.WorkFlowstatus;

                var requisitionRecordInfo = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == requisitionMaster.RequisitionId);

                IncompleteRequisitionObj.RequisitionId = requisitionMaster.RequisitionId;
                IncompleteRequisitionObj.Order = requisitionMaster?.OrderNumber;
                IncompleteRequisitionObj.MissingInfo = requisitionMaster?.MissingColumns;
                IncompleteRequisitionObj.Status = workFlowStatus;
                IncompleteRequisitionObj.StatusColor = _appDbContext.TblWorkFlowStatuses.FirstOrDefault(f => f.Id == (workFlowStatusId!= null? int.Parse(workFlowStatusId):0))?.WorkFlowColorStatus;
                IncompleteRequisitionObj.FirstName = requisitionMaster?.FirstName;
                IncompleteRequisitionObj.LastName = requisitionMaster?.LastName;
                IncompleteRequisitionObj.DateOfBirth = Convert.ToDateTime(requisitionMaster?.Dob).ToString("MM/dd/yyyy");
                IncompleteRequisitionObj.RequisitionTypeId = requisitionRecordInfo?.ReqTypeId;
                IncompleteRequisitionObj.RequisitionType = _appDbContext.TblLabRequisitionTypes.FirstOrDefault(f => f.ReqTypeId == IncompleteRequisitionObj.RequisitionTypeId)?.RequisitionType;

                var physicianName = $"{_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == requisitionMaster.PhysicianId)?.FirstName} {_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == requisitionMaster.PhysicianId)?.LastName}";
                IncompleteRequisitionObj.PhysicianName = physicianName;
                IncompleteRequisitionObj.ClientName = facilityName;
                IncompleteRequisitionObj.DateOfCollection = Convert.ToDateTime(requisitionMaster?.DateofCollection).ToString("MM/dd/yyyy");
                IncompleteRequisitionObj.TimeOfCollection = requisitionMaster?.TimeofCollection.ToString();

                var addedBy = $"{_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == requisitionMaster.CreatedBy)?.FirstName} {_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == requisitionMaster.CreatedBy)?.LastName}";
                IncompleteRequisitionObj.AddedBy = addedBy;




                response.Data.Add(IncompleteRequisitionObj); 

            }

            #region Search
            if (!string.IsNullOrEmpty(query.QueryModel?.Order))
                response.Data = response.Data.Where(w => w.Order != null && w.Order.Trim().ToLower().Contains(query.QueryModel?.Order.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.Status))
                response.Data = response.Data.Where(w => w.Status != null && w.Status.Trim().ToLower().Contains(query.QueryModel?.Status.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.MissingInfo))
                response.Data = response.Data.Where(w => w.MissingInfo != null && w.MissingInfo.Trim().ToLower().Contains(query.QueryModel?.MissingInfo.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.FirstName))
                response.Data = response.Data.Where(w => w.FirstName != null && w.FirstName.Trim().ToLower().Contains(query.QueryModel?.FirstName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LastName))
                response.Data = response.Data.Where(w => w.LastName != null && w.LastName.Trim().ToLower().Contains(query.QueryModel?.LastName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.DateOfBirth))
                response.Data = response.Data.Where(w => w.DateOfBirth != null && w.DateOfBirth.Trim().ToLower().Contains(query.QueryModel?.DateOfBirth.Trim().ToLower())).ToList();

            if (query.QueryModel?.RequisitionTypeId > 0)
                response.Data = response.Data.Where(w => w.RequisitionTypeId != null && w.RequisitionTypeId == query.QueryModel?.RequisitionTypeId).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionType))
                response.Data = response.Data.Where(w => w.RequisitionType != null && w.RequisitionType.Trim().ToLower().Contains(query.QueryModel?.RequisitionType.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.PhysicianName))
                response.Data = response.Data.Where(w => w.PhysicianName != null && w.PhysicianName.Trim().ToLower().Contains(query.QueryModel?.PhysicianName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.ClientName))
                response.Data = response.Data.Where(w => w.ClientName != null && w.ClientName.Trim().ToLower().Contains(query.QueryModel?.ClientName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.DateOfCollection))
                response.Data = response.Data.Where(w => w.DateOfCollection != null && w.DateOfCollection.Trim().ToLower().Contains(query.QueryModel?.DateOfCollection.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.TimeOfCollection))
                response.Data = response.Data.Where(w => w.TimeOfCollection != null && w.TimeOfCollection.Trim().ToLower().Contains(query.QueryModel?.TimeOfCollection.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.AddedBy))
                response.Data = response.Data.Where(w => w.AddedBy != null && w.AddedBy.Trim().ToLower().Contains(query.QueryModel?.AddedBy.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                response.Data = response.Data.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();
            }
            else
            {
                response.Data = response.Data.AsQueryable().OrderBy("RequisitionId desc").ToList();
            }

            response.Total = response.Data.Count;
            if (query.PageNumber > 0 && query.PageSize > 0)
                response.Data = response.Data.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();

            #endregion
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }
        public DataQueryResponse<List<WaitingForSignatureResponse>> WaitingForSignature(DataQueryModel<WaitingForSignatureQM> query)
        {
            var response = new DataQueryResponse<List<WaitingForSignatureResponse>>();
            response.Data = new();
            var userId = _connectionManager.UserId;
            var tblUsers = _masterDbContext.TblUsers.ToList();
            var adminTypeId = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == userId)?.AdminType;
            var adminType = _masterDbContext.TblOptionLookups.FirstOrDefault(f => f.Id == int.Parse(adminTypeId));

            //var requisitionStatusIds = new List<int?>() {1,2};
            var requisitionGroupInfos = _appDbContext.TblRequisitionOrders.Where(w => w.WorkFlowStatus == "9" && w.IsDeleted.Equals(false)).ToList();
            foreach (var requisitionGroupInfo in requisitionGroupInfos)
            {
                var WaitingForSignatureObj = new WaitingForSignatureResponse();

                var requisitionMasterInfos = _appDbContext.TblRequisitionMasters.FirstOrDefault(w => w.RequisitionId == requisitionGroupInfo.RequisitionId && w.RequisitionStatus == 6 && w.IsDeleted.Equals(false));
                string physicianName = $"{_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == requisitionMasterInfos.PhysicianId)?.FirstName} {_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == requisitionMasterInfos.PhysicianId)?.LastName}";

                WaitingForSignatureObj.RequisitionId = Convert.ToInt32(requisitionGroupInfo.RequisitionId);
                WaitingForSignatureObj.Status = _appDbContext.TblWorkFlowStatuses.FirstOrDefault(f => f.Id == int.Parse(requisitionGroupInfo.WorkFlowStatus))?.WorkFlowstatus;
                WaitingForSignatureObj.StatusColor = _appDbContext.TblWorkFlowStatuses.FirstOrDefault(f => f.Id == int.Parse(requisitionGroupInfo.WorkFlowStatus))?.WorkFlowColorStatus;
                WaitingForSignatureObj.FirstName = requisitionMasterInfos?.FirstName;
                WaitingForSignatureObj.LastName = requisitionMasterInfos?.LastName; 

                WaitingForSignatureObj.RequisitionTypeId = requisitionGroupInfo.ReqTypeId;
                WaitingForSignatureObj.RequisitionType = _appDbContext.TblLabRequisitionTypes.FirstOrDefault(f => f.ReqTypeId == requisitionGroupInfo.ReqTypeId)?.RequisitionType;
                WaitingForSignatureObj.PhysicianName = physicianName;
                WaitingForSignatureObj.DateOfCollection = Convert.ToDateTime(requisitionMasterInfos?.DateofCollection).ToString("MM/dd/yyyy");
                WaitingForSignatureObj.TimeOfCollection = requisitionMasterInfos?.TimeofCollection.ToString();
                WaitingForSignatureObj.PhysicianId = requisitionMasterInfos.PhysicianId;


                response.Data.Add(WaitingForSignatureObj);
            }

            #region Search
            if (!string.IsNullOrEmpty(query.QueryModel?.PhysicianName))
                response.Data = response.Data.Where(w => w.PhysicianName != null && w.PhysicianName.Trim().ToLower().Contains(query.QueryModel?.PhysicianName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.FirstName))
                response.Data = response.Data.Where(w => w.FirstName != null && w.FirstName.Trim().ToLower().Contains(query.QueryModel?.FirstName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LastName))
                response.Data = response.Data.Where(w => w.LastName != null && w.LastName.Trim().ToLower().Contains(query.QueryModel?.LastName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionType))
                response.Data = response.Data.Where(w => w.RequisitionType != null && w.RequisitionType.Trim().ToLower().Contains(query.QueryModel?.RequisitionType.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.DateOfCollection))
                response.Data = response.Data.Where(w => w.DateOfCollection != null && w.DateOfCollection.Trim().ToLower().Contains(query.QueryModel?.DateOfCollection.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.TimeOfCollection))
                response.Data = response.Data.Where(w => w.TimeOfCollection != null && w.TimeOfCollection.Trim().ToLower().Contains(query.QueryModel?.TimeOfCollection.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.Status))
                response.Data = response.Data.Where(w => w.Status != null && w.Status.Trim().ToLower().Contains(query.QueryModel?.Status.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.PhysicianId))
                response.Data = response.Data.Where(w => w.PhysicianId != null && w.PhysicianId == query.QueryModel?.PhysicianId).ToList();

            if (query.QueryModel?.RequisitionId > 0)
                response.Data = response.Data.Where(w => w.RequisitionId != 0 && w.RequisitionId == query.QueryModel?.RequisitionId).ToList();

            if (query.QueryModel?.RequisitionTypeId > 0)
                response.Data = response.Data.Where(w => w.RequisitionTypeId != 0 && w.RequisitionTypeId == query.QueryModel?.RequisitionTypeId).ToList();
            
            
            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                response.Data = response.Data.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();
            }
            else
            {
                response.Data = response.Data.AsQueryable().OrderBy("RequisitionId desc").ToList();
            }


            response.Total = response.Data.Count;
            if (query.PageNumber > 0 && query.PageSize > 0)
                response.Data = response.Data.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();

            #endregion
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }
        public dynamic Physician_Lookup()
        {
            var labId = _connectionManager.GetLabId();
            var userId = _connectionManager.UserId;
            // Check Logged In User is facility OR Admin
            var adminTypeOfloggedInUser = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == userId)?.AdminType;
            var adminType = _masterDbContext.TblOptionLookups.FirstOrDefault(f => f.Id == int.Parse(adminTypeOfloggedInUser) && f.Name.ToLower()=="physician")?.UserType;
            if (adminType == "FACILITY")
            {
                var tbl = _masterDbContext.TblUsers.Where(u => u.Id.Equals(userId)).Select(s => new
                {
                    Label = $"{s.FirstName} {s.LastName}",
                    Value = s.Id
                }).ToList();
                return tbl;
            }
            else
            {
                var physicianId = _masterDbContext.TblOptionLookups.FirstOrDefault(f => f.UserType.ToUpper() == "FACILITY" && f.Name.ToUpper() == "PHYSICIAN")?.Id;
                var labUsers = _masterDbContext.TblLabUsers.Where(l => l.LabId.Equals(labId)).Select(s => s.UserId).ToList();
                var tblUser = _masterDbContext.TblUsers.Where(u => labUsers.Contains(u.Id) && u.AdminType == physicianId.ToString()).Select(s => new
                {
                    Label = $"{s.FirstName} {s.LastName}",
                    Value = s.Id
                }).ToList();

                return tblUser;
            }
            
        }
        public RequestResponse Delete(int id)
        {
            var response = new RequestResponse();

            var getRecordForSoftDel = _appDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == id);
            if (getRecordForSoftDel != null)
            {
                getRecordForSoftDel.DeletedBy = _connectionManager.UserId;
                getRecordForSoftDel.DeletedDate = DateTimeNow.Get;
                getRecordForSoftDel.RequisitionStatus = 5;
                getRecordForSoftDel.IsDeleted = true;
                _appDbContext.TblRequisitionMasters.Update(getRecordForSoftDel);
                var getRecordForSoftDelTable2 = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == id);
                if (getRecordForSoftDelTable2 != null)
                {
                    getRecordForSoftDelTable2.DeletedBy = _connectionManager.UserId;
                    getRecordForSoftDelTable2.DeletedDate = DateTimeNow.Get;
                    getRecordForSoftDelTable2.LastWorkFlowStatus = getRecordForSoftDelTable2.WorkFlowStatus;
                    getRecordForSoftDelTable2.WorkFlowStatus = "29";
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
            _appDbContext.SaveChanges();

            response.Message = "Requisition Is Deleted !";
            response.HttpStatusCode = Status.Success;
            response.Data = getRecordForSoftDel.RequisitionId;

            return response;
        }
        public RequestResponse WaitingForSignatureSave(WaitingForSignatureSaveRequest request)
        {
            var response = new RequestResponse();

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

            foreach(var RequisitionId in request.RequisitionIds)
            {
                var existingRecordtbl1 = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == RequisitionId);
                if (existingRecordtbl1 != null)
                {
                    var existingRecordtbl2 = _appDbContext.TblLabRequisitionTypeWorkflowStatuses.FirstOrDefault(f => f.ActionPerformed.ToLower().Trim() == request.Status.ToLower().Trim() && f.PortalTypeId == portalType && f.LabId == existingRecordtbl1.LabId && f.ReqTypeId == existingRecordtbl1.ReqTypeId && f.IsActive.Equals(true));
                    if (existingRecordtbl2 != null)
                    {
                        existingRecordtbl1.LastWorkFlowStatus = existingRecordtbl1.WorkFlowStatus;
                        existingRecordtbl1.WorkFlowStatus = existingRecordtbl2.NextWorkFlowIdforAdmin?.ToString();

                        _appDbContext.TblRequisitionOrders.Update(existingRecordtbl1);
                    }
                    var existingRequisitionMasters = _appDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == RequisitionId);
                    if (existingRequisitionMasters != null)
                    {
                        existingRequisitionMasters.RequisitionStatus = 1;
                        existingRequisitionMasters.PhysicianSignature = request.PhysicianSignatureUrl;

                        _appDbContext.TblRequisitionMasters.Update(existingRequisitionMasters);
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

        public RequestResponse<FileContentResult> IncompleteRequisitionExportToExcel(int[]? selectedRow)
        {
            var response = new RequestResponse<FileContentResult>();

            var data = new List<IncompleteRequisitionResponse>();

            var requisitionStatusIds = new List<int?>() { 1, 2 };
            var requisitionMasters = _appDbContext.TblRequisitionMasters.Where(w => w.MissingColumns != null && requisitionStatusIds.Contains(w.RequisitionStatus)).ToList();

            foreach (var requisitionMaster in requisitionMasters)
            {
                var IncompleteRequisitionObj = new IncompleteRequisitionResponse(); 

                var facilityName = _appDbContext.TblFacilities.FirstOrDefault(f => f.FacilityId == requisitionMaster.FacilityId)?.FacilityName;
                var workFlowStatusId = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == requisitionMaster.RequisitionId)?.WorkFlowStatus;
                var workFlowStatus = _appDbContext.TblWorkFlowStatuses.FirstOrDefault(f => f.Id == (workFlowStatusId != null ? int.Parse(workFlowStatusId) : 0))?.WorkFlowstatus;

                var requisitionRecordInfo = _appDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == requisitionMaster.RequisitionId);

                IncompleteRequisitionObj.RequisitionId = requisitionMaster.RequisitionId;
                IncompleteRequisitionObj.Order = requisitionMaster?.OrderNumber;
                IncompleteRequisitionObj.MissingInfo = requisitionMaster?.MissingColumns;
                IncompleteRequisitionObj.Status = workFlowStatus;
                //IncompleteRequisitionObj.StatusColor = _appDbContext.TblWorkFlowStatuses.FirstOrDefault(f => f.Id == int.Parse(workFlowStatusId))?.WorkFlowColorStatus;
                IncompleteRequisitionObj.FirstName = requisitionMaster?.FirstName;
                IncompleteRequisitionObj.LastName = requisitionMaster?.LastName;
                IncompleteRequisitionObj.DateOfBirth = Convert.ToDateTime(requisitionMaster?.Dob).ToString("MM/dd/yyyy");
                IncompleteRequisitionObj.RequisitionTypeId = requisitionRecordInfo?.ReqTypeId;
                IncompleteRequisitionObj.RequisitionType = _appDbContext.TblLabRequisitionTypes.FirstOrDefault(f => f.ReqTypeId == IncompleteRequisitionObj.RequisitionTypeId)?.RequisitionType;

                var physicianName = $"{_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == requisitionMaster.PhysicianId)?.FirstName} {_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == requisitionMaster.PhysicianId)?.LastName}";
                IncompleteRequisitionObj.PhysicianName = physicianName;
                IncompleteRequisitionObj.ClientName = facilityName;
                IncompleteRequisitionObj.DateOfCollection = Convert.ToDateTime(requisitionMaster?.DateofCollection).ToString("MM/dd/yyyy");
                IncompleteRequisitionObj.TimeOfCollection = requisitionMaster?.TimeofCollection.ToString();

                var addedBy = $"{_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == requisitionMaster.CreatedBy)?.FirstName} {_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == requisitionMaster.CreatedBy)?.LastName}";
                IncompleteRequisitionObj.AddedBy = addedBy;




                data.Add(IncompleteRequisitionObj);

            }

            if (selectedRow?.Count() > 0)
            {
                data = data.Where(f => selectedRow.Contains(f.RequisitionId)).ToList();
            }

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Incomplete Requisition");

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

            worksheet.Cells[1, 6].Value = "RequisitionType";
            worksheet.Cells[1, 7].Value = "Physician Name";
            worksheet.Cells[1, 8].Value = "Facility Name";

            worksheet.Cells[1, 9].Value = "Date Of Collection";
            worksheet.Cells[1, 10].Value = "Time Of Collection";
            worksheet.Cells[1, 11].Value = "Added By";
            worksheet.Cells[1, 12].Value = "Missing Info";

            #endregion
            #region Add data to the worksheet
            for (var i = 0; i < data.Count; i++)
            {
                var row = i + 2;
                worksheet.Cells[row, 1].Value = data[i].Order;
                worksheet.Cells[row, 2].Value = data[i].Status;
                worksheet.Cells[row, 3].Value = data[i].FirstName;
                worksheet.Cells[row, 4].Value = data[i].LastName;
                worksheet.Cells[row, 5].Value = data[i].DateOfBirth;
                worksheet.Cells[row, 6].Value = data[i].RequisitionType; 
                worksheet.Cells[row, 7].Value = data[i].PhysicianName;
                worksheet.Cells[row, 8].Value = data[i].ClientName;
                worksheet.Cells[row, 9].Value = data[i].DateOfCollection;
                worksheet.Cells[row, 10].Value = data[i].TimeOfCollection;
                worksheet.Cells[row, 11].Value = data[i].AddedBy;
                worksheet.Cells[row, 12].Value = data[i].MissingInfo;


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

            #endregion

            response.Data = new FileContentResult(package.GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed Successfully";


            return response;
        }
    }
}
