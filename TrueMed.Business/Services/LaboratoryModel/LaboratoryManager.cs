using Microsoft.EntityFrameworkCore;

using TrueMed.Business.Interface;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Model.Laboratory;

namespace TrueMed.Business.Services.FacilityModel
{
    public static class LaboratoryManager
    {
        public static async Task<ICollection<LaboratoryBriefInfoViewModel>> GetLabBriefInfoByUserIdAsync(IConnectionManager connectionManager, string userId)
        {
            var userManagement = connectionManager.GetService<IUserManagement>();
            var labManagement = connectionManager.GetService<ILaboratoryManagement>();

            IQueryable<LaboratoryBriefInfoViewModel> labs;
            if (userManagement.GetUserTypeById(userId) != UserType.Master)
            {
                var labIds = await labManagement.GetUserLabIdsByUserIdAsync(userId);
                labs = labManagement.GetAllLabs()
                    .Where(x => labIds.Contains(x.Id ?? 0)).Select(
                    x => new
                LaboratoryBriefInfoViewModel
                    {
                        LabKey = x.LabKey,
                        LabName = x.LabName,
                        LabUrl = x.LabUrl,
                        Logo = x.Logo,
                        IsReferenceLab = x.IsReferenceLab
                    });
            }
            else
            {
                labs = labManagement.GetAllLabs().Select(x => new
                LaboratoryBriefInfoViewModel
                {
                    LabKey = x.LabKey,
                    LabName = x.LabName,
                    LabUrl = x.LabUrl,
                    Logo = x.Logo,
                    IsReferenceLab = x.IsReferenceLab
                });
            }

            return await labs.ToListAsync();
        }
    }
}
