using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;

namespace TrueMed.CompendiumManagement.Business.Interface
{
    public interface ISpecimenTypeAssignmentService
    {
        Task<RequestResponse> SaveSpecimenTypeAssignmentAsync(SpecimenTypeAssignmentRequest request);
        Task<DataQueryResponse<List<GetSpecimenTypeAssignmentDetailResponse>>> GetSpecimenTypeAssignmentDetailAsync(DataQueryModel<SpecimenTypeAssignmentQueryModel> query);
        Task<RequestResponse> DeleteSpecimenTypeAssignmentByIdAsync(int id);
        Task<RequestResponse> ChangeSpecimenTypeAssignmentStatusAsync(ChangeSpecimenTypeAssignmentStatusRequest request);
        Task<RequestResponse> ImportDataFromExcelToTableAsync(List<SpecimenTypeAssignmentImportFromExcelRequest> request);
        Task<RequestResponse<List<RequisitionTypeLookup>>> RequisitionTypeLookupAsync();
        Task<RequestResponse<List<SpecimenTypeLookupModel>>> SpecimenTypeLookupAsync();
        Task<RequestResponse<List<TestSetupLookup>>> TestLookupAsync();
        Task<RequestResponse<List<PanelLookupModel>>> GetPanelsByReqTypeId(int id);

    }
}
