using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SkiaSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.ReportingServer.Business.ReportHelpers;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business
{
    public class StandardRPPReportHeaderComponent : IComponent
    {
        private string Title1 { get; }
        private string Title2 { get; }
        private string ReportType { get; }
        private byte[] Logo { get; }
        private PatientInformation Patient;
        private FacilityInformation Facility;
        private SpecimenInformation Specimen;

        public StandardRPPReportHeaderComponent(string title1, string title2, byte[] logo,string reportType, PatientInformation patient, FacilityInformation facility, SpecimenInformation specimen)
        {

            Title1 = title1;
            Title2 = title2;
            Logo = logo;
            ReportType = reportType;
            Patient=patient;
           Facility = facility;
           Specimen = specimen;

        }

        
        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                column.Spacing(5);
                
                column.Item().Layers(layers =>
                {
                    //layers.Layer().Background(Colors.White);
                   

                    layers.Layer().Background(Colors.White).Column(column=> {
                        column.Item().Row(row =>
                        {
                            // Title  And logo
                            // column.Spacing(20);
                            row.ConstantItem(170).Height(50).Image(Logo).FitUnproportionally();
                            row.ConstantItem(150).Text(t =>
                            {

                            });
                            row.ConstantItem(230).Height(50).PaddingTop(20).Text(text =>
                            {
                                text.Span(Title1 + " ").FontFamily("Times New Roman").FontColor("#5bc0c7").FontSize(15).Bold();
                                text.Span(Title2).FontSize(11).Bold().FontColor(Colors.Black);
                            });



                        });

                    });
                    layers.PrimaryLayer().Column(column => {
                        //line row
                        column.Item().AlignCenter().PaddingTop(50).Width(470).LineHorizontal(1).LineColor(Colors.Black);
                    });
                });


                //// for Images 
                column.Item().Row(row =>
                {
                    row.Spacing(5);
                   
                   
                    row.ConstantItem(400).Text(t => { });
                    var imagepath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "ReportTemplates/Content/CliaImage.PNG");
                    row.ConstantItem(150).Height(50).Width(150).Image(imagepath); 
                //    row.ConstantItem(100).Height(70).Width(50).Image(Path.Combine(AppDomain.CurrentDomain.BaseDirectory,"Contents/NGSCLIALogoFooter.PNG")).WithRasterDpi(200);

                });

                // for Report Type

                column.Item().Text(t =>
                {
                    t.DefaultTextStyle(TypographyFonts.Headline);
                    t.AlignCenter();
                    t.Span(ReportType);
                });

                // for patient Info


                column.Item().Table(table =>
                {
                    int padding = 2;
                    string background = "#5bc0c7";
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(100);
                        columns.RelativeColumn(50);
                        columns.RelativeColumn(100);
                        columns.RelativeColumn(50);
                        columns.RelativeColumn(100);
                        columns.RelativeColumn(50);
                        columns.RelativeColumn(100);
                    });
                    table.Cell().Row(1).Column(1).Text("");
                    table.Cell().Row(1).Column(2).RowSpan(3).PaddingTop(-4).Image(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "ReportTemplates/Content/DOB.png"));
                    table.Cell().Row(1).Column(3).Text("");
                    table.Cell().Row(1).Column(4).RowSpan(3).PaddingTop(-4).Image(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "ReportTemplates/Content/Gender.png"));
                    table.Cell().Row(1).Column(5).Text("");
                    table.Cell().Row(1).Column(6).RowSpan(3).PaddingTop(-4).Image(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "ReportTemplates/Content/Race.png"));
                    table.Cell().Row(1).Column(7).Text("");

                    table.Cell().Row(2).Column(1).Background(background).Padding(padding).PaddingRight(0).PaddingLeft(0).DefaultTextStyle(TypographyFonts.PatientHeader).Text(text =>
                    {
                        text.AlignCenter();

                        text.Span("Patient Name");
                    });
                    table.Cell().Row(2).Column(3).Background(background).Padding(padding).DefaultTextStyle(TypographyFonts.PatientHeader).Text(text =>
                    {
                        text.AlignCenter();

                        text.Span("Date of Birth");
                    });
                    table.Cell().Row(2).Column(5).Background(background).Padding(padding).DefaultTextStyle(TypographyFonts.PatientHeader).Text(text =>
                    {
                        text.AlignCenter();

                        text.Span("Gender");
                    });
                    table.Cell().Row(2).Column(7).Background(background).Padding(padding).DefaultTextStyle(TypographyFonts.PatientHeader).Text(text =>
                    {
                        text.AlignCenter();
                        text.Span("Race");
                    });


                    table.Cell().Row(3).Column(1).Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(text =>
                    {
                        text.AlignCenter();

                        text.Span(Patient.Name??"");
                    });
                    table.Cell().Row(3).Column(3).Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(text =>
                    {
                        text.AlignCenter();

                        text.Span(Patient.DOB);
                    });
                    table.Cell().Row(3).Column(5).Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(text =>
                    {
                        text.AlignCenter();

                        text.Span(Patient.Gender??"");
                    });
                    table.Cell().Row(3).Column(7).Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(text =>
                    {
                        text.AlignCenter();
                        text.Span(Patient.Race);
                    });


                });

                // For Patient and Specimen Info


                column.Item().Row(row =>
                {
                    row.Spacing(5);
                    row.ConstantItem(230).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(100);
                            columns.RelativeColumn(200);
                            
                        });

                        var padding = 2;
                        table.Cell().Row(1).ColumnSpan(2).Padding(2).BorderBottom(1).DefaultTextStyle(TypographyFonts.Headline).Text(" Facility Info");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text("Provider Name");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(Facility?.ProviderName??"");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text("Facility");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(Facility?.FacilityName ?? "");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text("Phone");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(Facility?.Phone??"");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text("Facility Fax");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(Facility?.Fax??"");
                    });





                    row.ConstantItem(330).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(120);
                            columns.RelativeColumn(150);
                            columns.RelativeColumn(100);
                            columns.RelativeColumn(200);
                        });

                        var padding = 2;
                        table.Cell().Row(1).ColumnSpan(4).Padding(2).BorderBottom(1).DefaultTextStyle(TypographyFonts.Headline).Text(" Specimen Info");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text("Specimen ID");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(Specimen?.AccessionNo??"");

                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text("Report Date");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(Specimen?.ReportDate??"");

                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text("Collection Date");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(Specimen?.DateCollected);

                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text("Sample Type");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(Specimen?.SampleType??"");

                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text("Recieved Date");
                        table.Cell().Padding(padding).DefaultTextStyle(TypographyFonts.Normal).Text(Specimen?.DateReceived ?? "");
                    });




                });

                column.Item().Height(1).Canvas((canvas, space) =>
                {
                    SKColor color;
                    SKColor.TryParse("#5db8c4", out color);
                    // best to statically cache
                    using var paint = new SKPaint
                    {
                        StrokeWidth = 2,
                        
                        PathEffect = SKPathEffect.CreateDash(new float[] { 8, 8 }, 0),
                        Color = color
                    };

                    canvas.DrawLine(0, 0, space.Width, 0, paint);
                });






            });


        }


    }
}
