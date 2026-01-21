using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Laboratory;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Lab
{
    public class DirectorInfoViewModel: LabDirectorDetailsViewModel
    {
        public int LabId { get; set; }
    }
}
