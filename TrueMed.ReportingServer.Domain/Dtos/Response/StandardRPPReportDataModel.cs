namespace TrueMed.ReportingServer.Domain.Dtos.Response
{
    public class StandardRPPReportDataModel
    {
        public string Title1 { get; set; }
        public string Title2 { get; set; }
        public byte[] Logo { get; set; }
        public string ReportType { get; set; }
        public FacilityInformation Facility { get; set; } = new FacilityInformation();
        public PatientInformation Patient { get; set; } = new PatientInformation();
        public SpecimenInformation Specimen { get; set; } = new SpecimenInformation();
        public StandardRppContent Content { get; set; } = new StandardRppContent();
        public StandardRppFooter Footer { get; set; } = new StandardRppFooter();
    }

    public class StandardRppFooter
    {
        public string footerText1 { get; set; }
        public string footerText2 { get; set; }
        public string footerText3 { get; set; }
    }

    public class StandardRppContent
    {
        public string Comments { get; set; }
        public List<StandardReportRPPPositivePathgons> PositivePathgons { get; set; }
        public List<string> NegativePathogens { get; set; }
        public List<String> NegativeResistances { get; set; }

    }

    public class StandardReportRPPPositivePathgons
    {
        public string PanelName { get; set; }
        public List<PositivePathogen> Pathogens { get; set; }
    }

    public class PositivePathogen
    {
        public string PathogenName { get; set; }
        public string pathogeResult { get; set; }
    }

    public class FacilityInformation
    {
        public string FacilityName { get; set; }
        public string ProviderName { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }

        //public string FacilityName { get; set; }
        //public string ProviderName { get; set; }
        //public string Phone { get; set; }
        public string Address { get; set; }
    }
    public class PatientInformation
    {
        public string Name { get; set; }
        public string DOB { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string Race { get; set; }
        public string Address { get; set; }
    }
    public class SpecimenInformation
    {
        public string AccessionNo { get; set; }
        public string DateCollected { get; set; }
        public string DateReceived { get; set; }
        public string ReportDate { get; set; }
        public string SampleType { get; set; }

    }
}
