using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Response;

namespace TrueMed.ReportingServer.Business.Services.Interfaces
{
    public interface IReqOrderViewService
    {
        Task<RequestResponse<string>> GetReqOrderViewPdf(int reqId);
        Task<RequestResponse<string>> GetReqOrderRecords(int[] reqIds);
    }
}
