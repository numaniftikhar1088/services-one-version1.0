using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.FacilityManagement.Domain.Repositories.Facility.Interface
{
    public interface IFacilityBulkManagement
    {
        DataTable GetPhysiciansByIds();
    }
}
