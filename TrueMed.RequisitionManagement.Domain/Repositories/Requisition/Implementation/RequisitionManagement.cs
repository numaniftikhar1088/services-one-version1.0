using Microsoft.EntityFrameworkCore;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.Identity;
using TrueMed.Domain.Models.Response;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.Requisition.Dtos;
using TrueMed.RequisitionManagement.Domain.Models.Requisition.Request;
using TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Interface;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Implementation
{
    public class RequisitionManagement : IRequisitionManagement
    {
        private readonly ApplicationDbContext _appDbContext;
        private readonly MasterDbContext _masterDbContext;
        private readonly IConnectionManager _connectionManager;

        public RequisitionManagement(ApplicationDbContext applicationDbContext,
            MasterDbContext masterDbContext,
            IConnectionManager connectionManager
            )
        {
            _masterDbContext = masterDbContext;
            this._appDbContext = applicationDbContext;
            this._connectionManager = connectionManager;
        }

        public IQueryable<RequisitionTestTypeModel> GetAllTypes()
        {
            return _appDbContext.TblLabRequisitionTypes.Where(f => f.IsDeleted.Equals(false)).Select(x => new RequisitionTestTypeModel
            {
                CreateDate = x.CreatedDate,
                Id = x.ReqTypeId,
                Name = x.RequisitionTypeName,
                Type = x.RequisitionType,
                RequisitionColor = x.RequisitionColor,
                IsSelected = x.IsSelected,
                RequisitionId = x.MasterRequisitionTypeId,
                IsActive = x.IsActive ?? true
            });
        }

        public bool IsTypeExists(string type)
        {
            return _appDbContext.TblLabRequisitionTypes.Any(x => x.RequisitionType.Equals(type));
        }

        public bool IsExistsTypeById(int id)
        {
            return _appDbContext.TblLabRequisitionTypes.Any(x => x.ReqTypeId == id);
        }

        public async Task<bool> AddOrUpdateTypeAsync(RequisitionTypeViewModel requisitionTypeViewModel)
        {
            var isUpdating = requisitionTypeViewModel is UpdateRequisitionTypeViewModel;
            if (isUpdating && !IsExistsTypeById((int)requisitionTypeViewModel.Id))
                return false;

            var reqType = await _appDbContext.TblLabRequisitionTypes
                .FirstOrDefaultAsync(x => x.ReqTypeId == requisitionTypeViewModel.Id);

            if (reqType == null)
            {
                reqType = new TblLabRequisitionType();
                reqType.CreatedBy = _connectionManager.UserId;
                reqType.CreatedDate = DateTimeNow.Get;
            }
            else
            {
                reqType.UpdatedBy = _connectionManager.UserId;
                reqType.UpdatedDate = DateTimeNow.Get;
            }

            reqType.RequisitionType = requisitionTypeViewModel.Type;
            reqType.RequisitionTypeName = requisitionTypeViewModel.TypeName;
            reqType.IsActive = requisitionTypeViewModel.IsActive;
            reqType.RequisitionColor = requisitionTypeViewModel.RequisitionColor;
            reqType.IsSelected = requisitionTypeViewModel.IsSelected;
            reqType.MasterRequisitionTypeId = Convert.ToInt32(requisitionTypeViewModel.RequisitionId ?? 0);
            reqType.LabId = _connectionManager.GetLabId()?? Convert.ToInt32(_connectionManager.GetLabId());

            if (isUpdating)
                _appDbContext.Update(reqType).State = EntityState.Modified;
            else
                _appDbContext.Update(reqType).State = EntityState.Added;
            var isAffected = (await _appDbContext.SaveChangesAsync()) > 0;
            requisitionTypeViewModel.Id = reqType.ReqTypeId;
            return isAffected;
        }

        public int? GetTypeById(string type)
        {
            var reqType = _appDbContext.TblLabRequisitionTypes.Select(x => new { x.ReqTypeId, x.RequisitionType }).FirstOrDefault(x => x.RequisitionType.Equals(type));
            if (reqType == null)
                return null;
            return reqType.ReqTypeId;
        }

        public bool IsTypeValid(KeyValuePairViewModel<int?> uniqueKeyValidation)
        {
            if (GetTypeById(uniqueKeyValidation.KeyValue) == Convert.ToInt32(uniqueKeyValidation.Id))
            {
                return true;
            }
            else
            {
                return !IsTypeExists(uniqueKeyValidation.KeyValue);
            }
        }
        public async Task<bool> RequisitionTypeActivationByIdAsync(int reqTypeId, bool isActive)
        {
            return await _appDbContext.TblLabRequisitionTypes
                .Where(x => x.ReqTypeId == reqTypeId)
                .ExecuteUpdateAsync(x => x.SetProperty(p => p.IsActive, isActive)) > 0;
        }

        public RequestResponse RequisitionTypeStatusChanged(int id, bool status)
        {
            var response = new RequestResponse();

            var recordForStatusChanged = _appDbContext.TblLabRequisitionTypes.FirstOrDefault(f => f.ReqTypeId == id);
            if (recordForStatusChanged != null)
            {
                recordForStatusChanged.IsActive = status;

                _appDbContext.TblLabRequisitionTypes.Update(recordForStatusChanged);
                var ack = _appDbContext.SaveChanges();

                if (ack > 0)
                {
                    response.StatusCode = HttpStatusCode.OK;
                    response.Message = "Status Changed Successfully...";
                }
            }
            return response;
        }
        //public RequestResponse SaveEncodedText(EncodedTextRequest encodedTextRequest)
        //{
        //    var response = new RequestResponse();

        //    var key = $"{Guid.NewGuid().ToString().Replace("-", string.Empty).Substring(0, 10)}{DateTime.Now.ToString("ddMMyyhhmmss")}";
        //    if (string.IsNullOrEmpty(encodedTextRequest.EncodedText))
        //    {
        //        response.StatusCode = HttpStatusCode.BadRequest;
        //        response.Message = "Encoded Text Is Null !";
        //        return response;
        //    }
        //    var tblRequisitionEncoded = new TblRequisitionEncodedText()
        //    {
        //        Key = key,
        //        EncodedText = encodedTextRequest.EncodedText
        //    };
        //    _masterDbContext.TblRequisitionEncodedTexts.Add(tblRequisitionEncoded);
        //    var ack = _masterDbContext.SaveChanges();
        //    if (ack > 0)
        //    {
        //        response.Message = "Encoded Text Saved !";
        //        response.StatusCode = HttpStatusCode.OK;
        //        response.Data = key;
        //    }
        //    return response;
        //}
        //public RequestResponse<EncodedTextResponse> GetEncodedText(string? key)
        //{
        //    var response = new RequestResponse<EncodedTextResponse>();

        //    var recordByKey = _masterDbContext.TblRequisitionEncodedTexts.FirstOrDefault(x => x.Key == key);
        //    if (recordByKey != null)
        //    {
        //        response.Data = new EncodedTextResponse()
        //        {
        //            Key = recordByKey.Key,
        //            EncodedText = recordByKey.EncodedText
        //        };
        //        response.StatusCode = HttpStatusCode.OK;
        //        response.Message = "Request Proccessed !";
        //    }
        //    return response;
        //}
    }
}
