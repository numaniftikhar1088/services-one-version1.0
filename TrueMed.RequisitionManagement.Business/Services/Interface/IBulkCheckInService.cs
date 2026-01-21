using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;

namespace TrueMed.RequisitionManagement.Business.Services.Interface
{
    public interface IBulkCheckInService
    {
        Task<RequestResponse<DigitalCheckINRecordResponse>> GetDigitalCheckINRecord(DigitalCheckINRecordRequest request);
        DataQueryResponse<List<ScanHistoryResponse>> GetScanHistory(DataQueryModel<ScanHistoryQueryModel> query);
        Task<RequestResponse> UndoCheckIn(int id);
        DataQueryResponse<List<PendingDataEntryResponse>> GetPendingDataEntry(DataQueryModel<PendingDataEntryQueryModel> query);
        RequestResponse DeletePendingDataEntry(int id);
        dynamic GetPhysiciansLookup(int id);
        Task<List<CommonLookupResponse>> RequisitionType_Lookup();
        Task<RequestResponse<List<CommonLookupResponse>>> Insurance_Lookup();
        Task<List<CommonLookupResponse>> Panel_Lookup(int reqTypeId);
    }
}
