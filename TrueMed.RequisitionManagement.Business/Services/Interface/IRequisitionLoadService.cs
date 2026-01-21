using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.Requisition.Response;

namespace TrueMed.RequisitionManagement.Business.Services.Interface
{
    public interface IRequisitionLoadService
    {
        List<LoadReqSectionResponse> GetRequisitionSection(LoadReqSectionRequest request);
        List<SectionWithControlsAndDependenciesClient> LoadCommonSectionForRequisition(LoadCommonRequisitionRequest request);
 
        List<RequisitionOrderViewResponse> ViewRequisitionOrder(int requisitionId);
    }
}
