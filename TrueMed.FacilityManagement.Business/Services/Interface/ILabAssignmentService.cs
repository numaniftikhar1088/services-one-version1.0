using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Response;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;
using TrueMed.FacilityManagement.Domain.Models.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;

namespace TrueMed.FacilityManagement.Business.Services.Interface
{
    public interface ILabAssignmentService
    {
        Task<RequestResponse> SaveLabAssignmentAsync(AddLabAssignmentRequest request);
        Task<DataQueryResponse<List<LabAssignmentResponse>>> GetLabAssignmentDetailAsync(DataQueryModel<LabAssignmentQueryModel> query);
        Task<RequestResponse> DeleteByIdAsync(int id);
        Task<RequestResponse<List<ReferenceLabLookupDto>>> ReferenceLabLookupAsync();
        Task<List<CommonLookupResponse>> GetRequisitionTypesByLabId(int id);
        Task<List<CommonLookupResponse>> GetGroupsByRequisitionType(int id);
        Task<List<CommonLookupResponse>> GetInsuranceTypes();
        Task<List<CommonLookupResponse>> GetGender();
        Task<RequestResponse> SaveFacilitiesAsync(SaveFacilities request);
        Task<List<CommonLookupResponse>> GetFacilitiesLookup();

    }
}
