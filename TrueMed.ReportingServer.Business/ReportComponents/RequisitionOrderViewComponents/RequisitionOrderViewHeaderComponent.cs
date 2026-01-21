using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.ReportingServer.Business.ReportHelpers;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business.ReportComponents.RequisitionOrderViewComponents
{
    public class RequisitionOrderViewHeaderComponent : IComponent
    {
        private readonly ReqOrderViewHeader _model;

        public RequisitionOrderViewHeaderComponent(ReqOrderViewHeader model)
        {
            _model = model;
        }
        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                //column.Spacing(5);
                // logo and title
                column.Item().Row(row =>
                {


                    
                    
                    row.RelativeItem(30).Image(_model.Logo);
                    row.RelativeItem(35).Text("");
                    row.RelativeItem(25).PaddingTop(7).Column(column =>
                    {
                        //column.Item().Text(text =>
                        //{
                        //    //text.AlignCenter();
                        //    text.DefaultTextStyle(TypographyFonts.WoundHeadline);
                        //    text.Span(_model.Logo);
                        //});
                        column.Item().Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.CalibriHeadlineGreen);
                            text.Span(_model.Title);
                        });


                    });

                });
                // patient info

                //column.Item().Table(table =>
                //{

                //    table.Header(CalibriHeader =>
                //    {
                //        CalibriHeader.Cell().ColumnSpan(1).BorderRight(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentHeader).Text("Facility Information");
                //        CalibriHeader.Cell().ColumnSpan(1).BorderRight(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentHeader).Text("Patient Information");
                //        CalibriHeader.Cell().ColumnSpan(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentHeader).Text("Specimen Information");


                //    });
                //    table.ColumnsDefinition(columns =>
                //    {

                //        columns.RelativeColumn(30);
                //        columns.RelativeColumn(35);
                //        columns.RelativeColumn(30);
                //    });
                //    table.Cell().BorderRight(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Padding(2).Text("Facility Name: " + _model.Facility.FacilityName);
                //    table.Cell().PaddingLeft(3).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Padding(2).Text("Name: " + _model.Patient.PatientName);
                //    table.Cell().BorderLeft(1).PaddingLeft(3).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Padding(2).Text("Accession No: " + _model.Specimen.AccessionNo);
                //    table.Cell().BorderRight(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Padding(2).Text("Facility Address: " + _model.Facility.FacilityAddress);
                //    table.Cell().PaddingLeft(3).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Padding(2).Text("DOB: " + _model.Patient.PatientDob);
                //    table.Cell().BorderLeft(1).PaddingLeft(3).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Padding(2).Text("Date Collected: " + _model.Specimen.DateCollected);
                //    table.Cell().BorderRight(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Padding(2).Text("Facility Phone: " + _model.Facility.Phone);
                //    table.Cell().PaddingLeft(3).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Padding(2).Text("Gender: " + _model.Patient.Gender);
                //    table.Cell().BorderLeft(1).PaddingLeft(3).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Padding(2).Text("Date Received: " + _model.Specimen.DateReceived);
                //    table.Cell().BorderRight(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Padding(2).Text("Ordering Provider: " + _model.Facility.ProviderName);
                //    table.Cell().PaddingLeft(3).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Padding(2).Text("Phone Number: " + _model.Patient.Phone);
                //    table.Cell().BorderLeft(1).PaddingLeft(3).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Padding(2).Text("Date Received: " + _model.Specimen.DateResulted);

                //});
            });


        }
    }
}
