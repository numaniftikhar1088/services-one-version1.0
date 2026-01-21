using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.ReportingServer.Domain.Dtos.Response
{
    public class WoundPositiveDataModel
    {
        public WoundPositiveHeaderDataModel Header { get; set; }
        public WoundPositiveContentDataModel Content { get; set; }
    }

    public class WoundPositiveHeaderDataModel
    {
        public byte[] Logo { get; set; }
        public string Title { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Fax { get; set; }
        public string CLIA { get; set; }
        public string COLA { get; set; }
        public string DirectorName { get; set; }
        public string PanelName { get; set; }
        public FacilityInformation Facility { get; set; } = new FacilityInformation();
        public PatientInformation Patient { get; set; } = new PatientInformation();
        public SpecimenInformation Specimen { get; set; } = new SpecimenInformation();
    }

    public class WoundPositiveContentDataModel
    {

        public List<PositivePathogens> PositivePathgons { get; set; } = new List<PositivePathogens>();
        public List<PositiveResistances> PositiveResistances { get; set; } = new List<PositiveResistances>();
        public List<NegativePathogens> NegativePathogens { get; set; } = new List<NegativePathogens>();
        public List<NegativeResistances> NegativeResistances { get; set; } = new List<NegativeResistances>();
    }
    //public class FacilityInformation
    //{
    //    public string FacilityName { get; set; }
    //    public string Address { get; set; }
    //    public string ProviderName { get; set; }
    //    public string Phone { get; set; }
    //}
    //public class PatientInfo
    //{
    //    public string PatientName { get; set; }
    //    public string PatientDob { get; set; }
    //    public string Gender { get; set; }
    //    public string Phone { get; set; }
    //}
    //public class Specimen
    //{
    //    public string AccessionNo { get; set; }
    //    public string DateCollected { get; set; }
    //    public string DateReceived { get; set; }
    //    public string DateResulted { get; set; }
    //}
    public class PositivePathogens
    {
        public string pathogenName { get; set; }
        public string Qualitative { get; set; }// Estimated Microbial load
        public string EstMicrobialLoad { get; set; }// Estimated Cp/mL 

    }
    public class PositiveResistances
    {
        public string TestName { get; set; }//GENES
        public string AntibioticClass { get; set; }// Description

    }

    public class NegativePathogens
    {
        public string TestName { get; set; }
        public string Result { get; set; }

    }
    public class NegativeResistances
    {
        public string TestName { get; set; }//GENES
        public string AntibioticClass { get; set; }// Resistance Type
        public string Result { get; set; }

    }
}
