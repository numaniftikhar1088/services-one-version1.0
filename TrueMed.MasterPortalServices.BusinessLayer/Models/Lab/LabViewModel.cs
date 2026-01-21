using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalServices.BusinessLayer.Models.Lab
{
    public class LabQueryViewModel
    {
        public string? LabName { get; set; }
        public string? Code { get; set; }
        public string? Director { get; set; }
        public string? CLIA { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsReferenceLab { get; set; }
    }

    public class ReferenceLabQueryViewModel : LabQueryViewModel
    {
        private new bool IsReferenceLab = true;
    }
}
