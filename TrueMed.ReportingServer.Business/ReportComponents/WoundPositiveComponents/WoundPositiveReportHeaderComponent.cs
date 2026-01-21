using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.ReportingServer.Business.ReportHelpers;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business.ReportComponents.WoundPositiveComponents
{
    internal class WoundPositiveReportHeaderComponent : IComponent
    {
        private readonly WoundPositiveHeaderDataModel _model;

        public WoundPositiveReportHeaderComponent(WoundPositiveHeaderDataModel model)
        {
            _model = model;
        }
        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                column.Spacing(5);
                // logo and title
                column.Item().Row(row =>
                {


                    row.RelativeItem(40).AlignLeft().Column(column =>
                    {
                        column.Item().Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.WoundHeadline);
                            text.Span(_model.Title);
                        });
                        column.Item().Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.WoundContentNormal);
                            text.Span(_model.Address);
                        });
                        column.Item().Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.WoundContentNormal);
                            text.Span("Phone No: " + _model.PhoneNumber + " Fax No: " + _model.Fax);
                        });
                        column.Item().Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.WoundContentNormal);
                            text.Span("CLIA #: " + _model.CLIA + " COLA #: " + _model.COLA);
                        });
                        column.Item().Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.WoundContentBold);
                            text.Span("Medical Director: " + _model.DirectorName);
                        });

                    });
                    row.RelativeItem(20).Text("");
                    row.RelativeItem(30).Image(_model.Logo);


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

                column.Item().PaddingTop(10).Row(row =>
                {
                    row.Spacing(5);
                    row.RelativeItem(33).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().BorderRight(1).PaddingTop(5).PaddingBottom(5).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentHeader).Text("Facility Information");
                        });

                        table.Cell().BorderRight(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Facility Name: " + _model.Facility.FacilityName);
                        table.Cell().BorderRight(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Facility Address: " + _model.Facility.Address);
                        table.Cell().BorderRight(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Facility phone: " + _model.Facility.Phone);
                        table.Cell().BorderRight(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Ordering Provider: " + _model.Facility.ProviderName);
                        //foreach (var item in _content.NegativePathogens.ToList())
                        //    table.Cell().DefaultTextStyle(TypographyFonts.ContentNormal).Text(item);


                    });

                    row.RelativeItem(33).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().PaddingTop(5).BorderRight(1).PaddingBottom(5).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentHeader).Text("Patient Information");
                        });

                        table.Cell().BorderRight(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Name: " + _model.Patient.Name);
                        table.Cell().BorderRight(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("DOB: " + _model.Patient.DOB);
                        table.Cell().BorderRight(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Gender: " + _model.Patient.Gender);
                        table.Cell().BorderRight(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Phone: " + _model.Patient.Phone);

                        //foreach (var item in _content.NegativeResistances.ToList())
                        //    table.Cell().DefaultTextStyle(TypographyFonts.ContentNormal).Text(item);


                    });
                    row.RelativeItem(32).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().PaddingTop(5).PaddingBottom(5).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentHeader).Text("Specimen Information");
                        });

                        table.Cell().PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Accession No: " + _model.Specimen.AccessionNo);
                        table.Cell().PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Date Collected: " + _model.Specimen.DateCollected);
                        table.Cell().PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Date Received: " + _model.Specimen.DateReceived);
                        table.Cell().PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Date Resulted: " + _model.Specimen.ReportDate);

                        //foreach (var item in _content.NegativeResistances.ToList())
                        //    table.Cell().DefaultTextStyle(TypographyFonts.ContentNormal).Text(item);


                    });

                });
                column.Item().PaddingTop(5).Row(row =>
                {
                    row.RelativeItem(100).AlignCenter().DefaultTextStyle(TypographyFonts.CalibriContentTitleBlue).Text("Wound Pathogen Report");


                });
                column.Item().Row(row =>
                {


                    row.RelativeItem(6).AlignLeft().Column(column =>
                    {
                        column.Item().Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.WoundHeadline);
                            text.Span("Panel");
                        });

                    });
                    row.RelativeItem(85).AlignLeft().Column(column =>
                    {
                        column.Item().Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.WoundContentHeader);
                            text.Span("WPP RT-PCR");
                        });

                    });
                    row.RelativeItem(10).AlignLeft().Column(column =>
                    {
                        column.Item().Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.WoundContentNormalBold);
                            text.Span("Final Report");
                        });

                    });

                });
                //column.Item().BorderBottom(1).BorderColor("#0d9344").Row(row =>
                //{
                //    row.Spacing(3);
                //    row.RelativeItem(33).AlignCenter().Padding(3).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(_model.patientName);
                //    row.RelativeItem(33).AlignCenter().Padding(3).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(_model.DateOfBirth);
                //    row.RelativeItem(33).AlignCenter().Padding(3).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(_model.Gender);

                //});


            });


        }
    }
}
