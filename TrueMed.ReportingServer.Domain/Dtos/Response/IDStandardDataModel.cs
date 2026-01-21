using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.ReportingServer.Domain.Dtos.Response
{
    public class IDStandardDataModel
    {
        public IDStandardHeaderDataModel Header { get; set; } = new IDStandardHeaderDataModel();
        public IDStandardContentDataModel Content { get; set; } = new IDStandardContentDataModel();
    }

    public class IDStandardHeaderDataModel
    {
        public byte[] Logo { get; set; }
        public string Title { get; set; }
        public FacilityInformation Facility { get; set; } = new FacilityInformation();
        public PatientInformation Patient { get; set; } = new PatientInformation();
        public SpecimenInformation Specimen { get; set; } = new SpecimenInformation();
    }

    public class IDStandardContentDataModel
    {

        public List<PathogensForID> Pathogens { get; set; } = new List<PathogensForID>();
        public List<PositiveResistancesForID> PositiveResistancesForId { get; set; } = new List<PositiveResistancesForID>();
        // public List<NegativePathogensForID> NegativePathogens { get; set; } = new List<NegativePathogensForID>();
        public List<string> NegativeResistances { get; set; } = new List<string>();
    }

    public class PathogensForID
    {
        public string PanelName { get; set; }
        public List<PositivePathogensListForID> PositivePathogensList { get; set; }
        public List<string> NegativePathogensForId { get; set; } = new List<string>();
       
    }
    public class PositivePathogensListForID
    {
        public string pathogenName { get; set; }
        public string Qualitative { get; set; }// Estimated Microbial load
        public string EstMicrobialLoad { get; set; }// Estimated Cp/mL 
        public string Results { get; set; }// Estimated Cp/mL 
    }
    public class PositiveResistancesForID
    {
        public string TestName { get; set; }//GENES
        public string Result { get; set; }// Description

    }
}
