using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.ReportingServer.Domain.Dtos.Response
{
    public class StandardUTIReportDataModel
    {
        public StandardUTIHeaderDataModel Header { get; set; } = new StandardUTIHeaderDataModel();
        public StandardUTIContentDataModel Content { get; set; } = new StandardUTIContentDataModel();
    }

    public class StandardUTIHeaderDataModel
    {
        public byte[] Logo { get; set; }
        public string Title1 { get; set; }
        public string Title2 { get; set; }
        public string patientName { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
    }

    public class StandardUTIContentDataModel
    {
        public FacilityInformation Facility { get; set; } = new FacilityInformation();
        public SpecimenInformation Specimen { get; set; } = new SpecimenInformation();
        public List<PositivePathogensList> PositivePathgons { get; set; } = new List<PositivePathogensList>();
        public List<string> NegativePathogens { get; set; } = new List<string>();
        public List<String> NegativeResistances { get; set; } = new List<string>();
    }
    //public class FacilityInformation
    //{
    //    public string FacilityName { get; set; }
    //    public string ProviderName { get; set; }
    //    public string Phone { get; set; }
    //    public string FacilityAddress { get; set; }

    //}
    //public class SpecimenInformation
    //{
    //    public string AccessionNo { get; set; }
    //    public string DateCollected { get; set; }
    //    public string DateReceived { get; set; }
    //    public string ReportDate { get; set; }
    //}
    public class PositivePathogensList
    {
        public string pathogenName { get; set; }
        public string CtValue { get; set; }

    }
}
