using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.ReportingServer.Business.ReportHelpers;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business.ReportComponents.UTIStandardComponents
{
    public class UTIStandardReportContentComponent : IComponent
    {
        private readonly StandardUTIContentDataModel _model;

        public UTIStandardReportContentComponent(StandardUTIContentDataModel model)
        {
            _model = model;
        }

        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                column.Spacing(2);
                // Facility Info Title
                column.Item().Row(row =>
                {
                    row.RelativeItem(100).Background("#2e679b").AlignCenter().DefaultTextStyle(TypographyFonts.CalibriContentTitle).Text("Facility Info".ToUpper());


                });

                // facility info columns
                column.Item().Row(row =>
                {
                    row.Spacing(3);
                    row.RelativeItem(33).Background("#f2f3f4").Padding(5).Column(column =>
                    {
                        column.Item().Text(text =>
                        {

                            text.DefaultTextStyle(TypographyFonts.CalibriHeader);
                            text.Span("Ordering Provider".ToUpper());
                        });
                        column.Item().PaddingTop(5).Text(text =>
                        {
                            text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.CalibriContentNormal);
                            text.Span(_model.Facility?.ProviderName);
                        });
                    });
                    row.RelativeItem(33).Background("#f2f3f4").Padding(4).Column(column =>
                    {
                        column.Item().Text(text =>
                        {

                            text.DefaultTextStyle(TypographyFonts.CalibriHeader);
                            text.Span("Ordering Provider".ToUpper());
                        });
                        column.Item().PaddingTop(5).Text(text =>
                        {
                            text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.CalibriContentNormal);
                            text.Span(_model.Facility?.FacilityName);
                        });
                    });
                    row.RelativeItem(33).Background("#f2f3f4").Padding(4).Column(column =>
                    {
                        column.Item().Text(text =>
                        {
                            text.DefaultTextStyle(TypographyFonts.CalibriHeader);
                            text.Span("Phone".ToUpper());
                        });
                        column.Item().PaddingTop(5).Text(text =>
                        {
                            text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.CalibriContentNormal);
                            text.Span(_model.Facility?.Phone);
                        });
                    });
                });

                // Specimen Info Title
                column.Item().Row(row =>
                {
                    row.RelativeItem(100).Background("#2e679b").AlignCenter().DefaultTextStyle(TypographyFonts.CalibriContentTitle).Text("Specimen Info".ToUpper());


                });
                // Specimen info CalibriHeader
                column.Item().Row(row =>
                {
                    row.Spacing(3);
                    row.RelativeItem(25).Background("#f2f3f4").Padding(4).Column(column =>
                    {
                        column.Item().Text(text =>
                        {

                            text.DefaultTextStyle(TypographyFonts.CalibriHeader);
                            text.Span("Accession Number".ToUpper());
                        });
                        column.Item().PaddingTop(5).Text(text =>
                        {
                            //text.AlignCenter();

                            text.DefaultTextStyle(TypographyFonts.CalibriContentNormal);
                            text.Span(_model.Specimen?.AccessionNo);
                        });
                    });
                    row.RelativeItem(25).Background("#f2f3f4").Padding(4).Column(column =>
                    {
                        column.Item().Text(text =>
                        {

                            text.DefaultTextStyle(TypographyFonts.CalibriHeader);
                            text.Span("Collection Date".ToUpper());
                        });
                        column.Item().PaddingTop(5).Text(text =>
                        {
                            text.DefaultTextStyle(TypographyFonts.CalibriContentNormal);
                            text.Span(_model.Specimen?.DateCollected);
                        });
                    });
                    row.RelativeItem(25).Background("#f2f3f4").Padding(4).Column(column =>
                    {
                        column.Item().Text(text =>
                        {
                            text.DefaultTextStyle(TypographyFonts.CalibriHeader);
                            text.Span("Received Date".ToUpper());
                        });
                        column.Item().PaddingTop(5).Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.CalibriContentNormal);
                            text.Span(_model.Specimen?.DateReceived);
                        });
                    });
                    row.RelativeItem(25).Background("#f2f3f4").Padding(4).Column(column =>
                    {
                        column.Item().Text(text =>
                        {
                            text.DefaultTextStyle(TypographyFonts.CalibriHeader);
                            text.Span("Date Reported".ToUpper());
                        });
                        column.Item().PaddingTop(5).Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.CalibriContentNormal);
                            text.Span(_model.Specimen?.ReportDate);
                        });
                    });
                });
                // Clinical Summary
                column.Item().Row(row =>
                {
                    row.RelativeItem(100).Background("#2e679b").AlignCenter().DefaultTextStyle(TypographyFonts.CalibriContentTitle).Text("Clinical Summary".ToUpper());


                });
                column.Item().PaddingTop(3).Row(row =>
                {
                    row.Spacing(3);
                    row.RelativeItem(35).Background("#f2f3f4").Padding(4).Column(column =>
                    {
                        column.Item().Text(text =>
                        {

                            text.DefaultTextStyle(TypographyFonts.CalibriHeader);
                            text.Span("Pathogens Detected".ToUpper());
                        });
                        foreach (var itm in _model.PositivePathgons)
                        {
                            column.Item().Text(text =>
                            {
                                //text.AlignCenter();
                                text.DefaultTextStyle(TypographyFonts.CalibriContentDangerNormal);
                                text.Span(itm.pathogenName);
                            });
                        }

                    });
                    row.RelativeItem(20).Padding(4).AlignCenter().Text("text");
                    row.RelativeItem(33).Background("#f2f3f4").Padding(4).Column(column =>
                    {
                        column.Item().Text(text =>
                        {

                            text.DefaultTextStyle(TypographyFonts.CalibriHeader);
                            text.Span("Resistant Genes Detected".ToUpper());
                        });
                        if (_model.NegativeResistances.Count > 0)
                        {
                            foreach (object item in _model.NegativeResistances)
                            {
                                column.Item().Text(text =>
                                {
                                    text.AlignCenter();
                                    text.DefaultTextStyle(TypographyFonts.CalibriContentNormal);
                                    text.Span(item.ToString());
                                });
                            }
                        }

                    });
                    row.RelativeColumn(10).Text("");
                });
                // Pathogen Tests Results
                column.Item().Background("#f2f3f4").Table(table =>
                {
                    table.Header(CalibriHeader =>
                    {
                        CalibriHeader.Cell().ColumnSpan(4).Background("#2e679b").AlignCenter().DefaultTextStyle(TypographyFonts.CalibriContentTitle).Text("Pathogen Test Results".ToUpper());


                    });
                    table.ColumnsDefinition(columns =>
                    {

                        columns.RelativeColumn(10);
                        columns.RelativeColumn(40);
                        columns.RelativeColumn(10);
                        columns.RelativeColumn(40);
                    });
                    foreach (var item in _model.NegativePathogens)
                    {
                        table.Cell().DefaultTextStyle(TypographyFonts.CalibriContentNormal).Padding(2).Text("-");
                        table.Cell().DefaultTextStyle(TypographyFonts.CalibriContentNormal).Padding(2).Text(item);
                    }
                    foreach (var itm in _model.PositivePathgons)
                    {
                        table.Cell().DefaultTextStyle(TypographyFonts.ContentDangerNormal).Padding(2).Text("+");
                        table.Cell().DefaultTextStyle(TypographyFonts.ContentDangerNormal).Padding(2).Text(itm.pathogenName + " Ct=(" + itm.CtValue + ")");
                    }

                });
                column.Item().Row(row =>
                {
                    row.RelativeItem(100).Background("#2e679b").AlignCenter().DefaultTextStyle(TypographyFonts.CalibriContentTitle).Text("Disclaimer".ToUpper());

                });
                column.Item().Row(row =>
                {
                    row.RelativeItem(100).Padding(3).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text("This is a qualitative test. Ct values should not be considered quantitative measures of viral load. Ct values are affected by several pre-examination" +
                        ", \r\nexamination and post-examination factors including patient preparation, time between exposure and specimen collection, efficiency and variability in \r\nspecimen collection, biological variance and presence of inhibitors.\r\nThe Urinary " +
                        "Tract Infection (UTI) Panel was performed utilizing RT-PCR methodologies with the ThermoFisher QuantStudio12K® and microorganism-specific \r\nTaqMan® allele probes. This laboratory determined test (LDT) has not been cleared or approved by the Food " +
                        "and Drug Administration. The FDA has \r\ndetermined that such clearance or approval is not necessary. This test is used for clinical purposes. It should not be regarded as investigational or for \r\nresearch. \r\nAll testing is performed by . This laboratory " +
                        "is certified under the Clinical Laboratory Improvement Amendments (CLIA) as qualified to perform high \r\ncomplexity clinical laboratory testing.\r\n");

                });

            });
        }
    }
}
