using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Databases;

namespace TrueMed.Domain.Repositories.Lab.Interface
{
    public partial interface IFacilityUserManagement 
    {
        bool AddUserInFacilitiesByUserId(string userId, params int[] facilityIds);
        Task<string[]> GetAllProvidersByFacilityIdAsync(int facilityId);
        bool IsUserExistsInFacilityByUserId(string userId, int facilityId);
        bool RemoveAllUsersByFacilityId(int facilityId);
    
    }
}
