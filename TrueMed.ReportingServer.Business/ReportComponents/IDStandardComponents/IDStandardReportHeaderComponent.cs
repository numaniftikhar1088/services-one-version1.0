using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.ReportingServer.Business.ReportHelpers;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business.ReportComponents.IDStandardComponents
{
    public class IDStandardReportHeaderComponent : IComponent
    {
        private readonly IDStandardHeaderDataModel _model;

        public IDStandardReportHeaderComponent(IDStandardHeaderDataModel component)
        {
            _model = component;
        }
        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                column.Spacing(5);
                // logo and title
                column.Item().Row(row =>
                {

                    row.RelativeItem(40).Image(_model.Logo);
                    row.RelativeItem(43).Text("");
                    row.RelativeItem(17).PaddingTop(15).AlignLeft().Column(column =>
                    {
                        column.Item().Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.IDStandardHeader);
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

                column.Item().PaddingTop(50).PaddingBottom(1).Border(1).BorderColor("#338582").Row(row =>
                {
                    row.Spacing(5);
                    row.RelativeItem(32).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().PaddingLeft(10).PaddingTop(5).DefaultTextStyle(TypographyFonts.IDStandardHeader).Text("Facility Information");
                        });

                        table.Cell().PaddingLeft(10).PaddingBottom(7).Text(formattedText =>
                        {
                            formattedText.Span("Facility Name: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span(_model.Facility.FacilityName, TypographyFonts.IDStandardContentNormal);
                        });// + _model.Specimen.AccessionNo);.DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Facility Name: ");
                        //wtable.Cell().PaddingLeft(10).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text(" ");
                        table.Cell().PaddingLeft(10).Text(formattedText =>
                        {
                            formattedText.Span("Provider Name: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span(_model.Facility.ProviderName, TypographyFonts.IDStandardContentNormal);
                        });// + _model.Specimen.AccessionNo);.DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Provider Name: ");
                        table.Cell().PaddingLeft(15).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Address: ");
                        table.Cell().PaddingLeft(15).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text(_model.Facility.Address);

                        //foreach (var item in _content.NegativePathogens.ToList())
                        //    table.Cell().DefaultTextStyle(TypographyFonts.ContentNormal).Text(item);


                    });

                    row.RelativeItem(31).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().PaddingTop(5).DefaultTextStyle(TypographyFonts.IDStandardHeader).Text("Patient Information");
                        });

                        table.Cell().PaddingLeft(1).Text(formattedText =>
                        {
                            formattedText.Span("Name: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span(_model.Patient.Name, TypographyFonts.IDStandardContentNormal);
                        });// + _model.Specimen.AccessionNo);.DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Name: ");
                        table.Cell().PaddingLeft(1).Text(formattedText =>
                        {
                            formattedText.Span("DOB: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span(_model.Patient.DOB, TypographyFonts.IDStandardContentNormal);
                        });// + _model.Specimen.AccessionNo);.DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("DOB: ");// + _model.Facility.FacilityAddress);
                        table.Cell().PaddingLeft(1).Text(formattedText =>
                        {
                            formattedText.Span("Gender: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span(_model.Patient.Gender, TypographyFonts.IDStandardContentNormal);
                        });// + _model.Specimen.AccessionNo);.DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Gender: ");// + _model.Facility.Phone);
                        table.Cell().PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Address: ");// + _model.Facility.ProviderName);
                        table.Cell().PaddingLeft(1).DefaultTextStyle(TypographyFonts.WoundContentNormal).Text(_model.Patient.Address);// + _model.Facility.ProviderName);

                        //foreach (var item in _content.NegativeResistances.ToList())
                        //    table.Cell().DefaultTextStyle(TypographyFonts.ContentNormal).Text(item);


                    });
                    row.RelativeItem(35).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().PaddingTop(5).DefaultTextStyle(TypographyFonts.IDStandardHeader).Text("Specimen Information");
                        });

                        table.Cell().PaddingLeft(1).Text(formattedText =>
                        {
                            formattedText.Span("Accession No: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span(_model.Specimen.AccessionNo, TypographyFonts.IDStandardContentNormal);
                        });// + _model.Specimen.AccessionNo);
                        table.Cell().PaddingLeft(1).Text(formattedText =>
                        {
                            formattedText.Span("Date Collected: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span(_model.Specimen.DateCollected, TypographyFonts.IDStandardContentNormal);
                        });// + _model.Specimen.DateCollected);
                        table.Cell().PaddingLeft(1).Text(formattedText =>
                        {
                            formattedText.Span("Date Received: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span(_model.Specimen.DateReceived, TypographyFonts.IDStandardContentNormal);
                        });// + _model.Specimen.AccessionNo);
                        table.Cell().PaddingLeft(1).Text(formattedText =>
                        {
                            formattedText.Span("Report Date: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span(_model.Specimen.ReportDate, TypographyFonts.IDStandardContentNormal);
                        });// + _model.Specimen.DateCollected);
                        table.Cell().PaddingLeft(1).PaddingBottom(10).Text(formattedText =>
                        {
                            formattedText.Span("Sample Type: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span(_model.Specimen.SampleType, TypographyFonts.IDStandardContentNormal);
                        });

                        //foreach (var item in _content.NegativeResistances.ToList())
                        //    table.Cell().DefaultTextStyle(TypographyFonts.ContentNormal).Text(item);


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
