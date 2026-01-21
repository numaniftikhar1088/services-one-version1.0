using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.Domain.Repositories.Lab.Interface;
using TrueMed.FacilityManagement.Domain.Models.Facility.DTOs;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.Business.Services.FacilityModel
{
    public static class FacilityManager
    {
        public static async Task<FacilityResult> AddOrUpdateFacilityAsync(
            FacilityViewModel facilityViewModel,
            IConnectionManager connectionManager)
        {
            var facilityManagement = connectionManager.GetService<IFacilityManagement>();

            #region custom-validation
            var identityResult = new FacilityResult(Status.Failed, "One or more valdation errors.");
            if (!await facilityManagement.IsFacilityNameValidAsync(
                new KeyValuePairViewModel<int?>
                {
                    Id = facilityViewModel.GeneralInfo.FacilityId,
                    KeyValue = facilityViewModel.GeneralInfo.FacilityName
                }))
            {
                identityResult.AddError(nameof(facilityViewModel.GeneralInfo.FacilityName), "AlreadyFound");
                return identityResult;
            }
            #endregion custom-validation
            else
            {
                return await facilityManagement.AddOrUpdateFacilityAsync(facilityViewModel);
            }
        }
    }
}