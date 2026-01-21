using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Enums;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{



    public class SaveRequisitionRequest
    {
        public int RequisitionId { get; set; }
        public bool IsPatientInfoChanged { get; set; }
        public String Action { get; set; }
        public List<string> MissingFields { get; set; }
        public List<RequistionType> Requisitions { get; set; }

    }

    public class RequistionType
    {
        public int ReqId { get; set; }
        public string ReqName { get; set; }
        public List<ReqSections> reqSections { get; set; }

    }


    public class ReqSections
    {
        public int SectionId { get; set; }
        public String SectionName { get; set; }

        public List<ReqField> Fields { get; set; }




    }

    public class ReqField
    {
        public int ControlId { get; set; }
        public string UIType { get; set; }
        public SectionType FieldType { get; set; }
        public string DisplayName { get; set; }
        public string SystemFieldName { get; set; }
        public dynamic FieldValue { get; set; }
        //public dynamic FieldValue { get; set; }

    }
}
