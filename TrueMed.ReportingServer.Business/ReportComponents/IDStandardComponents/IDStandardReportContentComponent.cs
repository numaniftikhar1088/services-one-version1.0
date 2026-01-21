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
    public class IDStandardReportContentComponent : IComponent
    {

        private readonly IDStandardContentDataModel _model;

        public IDStandardReportContentComponent(IDStandardContentDataModel component)
        {
            _model = component;
        }
        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                column.Spacing(5);
                // logo and title
                    column.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                        });

                        table.Cell().PaddingLeft(1).Text(formattedText =>
                        {
                            formattedText.Span("Prescribed Medications: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span("No Mediciations Reported", TypographyFonts.IDStandardContentNormal);
                        });
                        table.Cell().PaddingLeft(1).Text(formattedText =>
                        {
                            formattedText.Span("Known Drug Allergies: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span("No Known Allergies", TypographyFonts.IDStandardContentNormal);
                        });
                        table.Cell().Text(formattedText =>
                        {
                            formattedText.Span("Clinical Information: ", TypographyFonts.IDStandardContentNormalBold);
                            formattedText.Span(null, TypographyFonts.IDStandardContentNormal);
                        });
                        //foreach (var item in _content.NegativeResistances.ToList())
                        //    table.Cell().DefaultTextStyle(TypographyFonts.ContentNormal).Text(item);


                    });
                    column.Item().Row(row =>
                    {


                        row.RelativeItem(8).AlignLeft().Column(column =>
                        {
                            column.Item().Text(text =>
                            {
                                //text.AlignCenter();
                                text.DefaultTextStyle(TypographyFonts.IDStandardHeadingBlack);
                                text.Span("Panel");
                            });

                        });
                        row.RelativeItem(85).AlignLeft().Column(column =>
                        {
                            column.Item().Text(text =>
                            {
                                //text.AlignCenter();
                                text.DefaultTextStyle(TypographyFonts.IDStandardHeading);
                                text.Span("Antibiotic Resistance");
                            });
                        });


                    });
                    column.Item().BorderBottom(1).Row(row =>
                    {


                        row.RelativeItem(45).AlignLeft().Column(column =>
                        {
                            column.Item().Text(text =>
                            {
                                //text.AlignCenter();
                                text.DefaultTextStyle(TypographyFonts.WoundHeadline);
                                text.Span("Organism Detected").Bold();
                            });

                        });
                        row.RelativeItem(55).AlignLeft().Column(column =>
                        {
                            column.Item().Text(text =>
                            {
                                //text.AlignCenter();
                                text.DefaultTextStyle(TypographyFonts.WoundHeadline);
                                text.Span("Results");
                            });
                        });


                    });
                    

                        if (_model.PositiveResistancesForId.Count() > 0)
                        {
                            foreach (var item in _model.PositiveResistancesForId)
                            {
                        column.Item().Row(row =>
                        {

                            row.RelativeItem(45).AlignLeft().Column(column =>
                                {
                                    column.Item().Text(text =>
                                    {
                                        //text.AlignCenter();
                                        text.DefaultTextStyle(TypographyFonts.IDStandardContentNormalDanger);
                                        text.Span(item.TestName);
                                    });

                                });
                                row.RelativeItem(55).AlignLeft().Column(column =>
                                {
                                    column.Item().Text(text =>
                                    {
                                        //text.AlignCenter();
                                        text.DefaultTextStyle(TypographyFonts.IDStandardContentNormalDanger);
                                        text.Span(item.Result);
                                    });
                                });


                        });
                    }

                        }
                        else
                        {
                    column.Item().Row(row =>
                    {

                        row.RelativeItem().AlignCenter().Column(column =>
                            {
                                column.Item().Text(text =>
                                {
                                    //text.AlignCenter();
                                    text.DefaultTextStyle(TypographyFonts.IDStandardContentNormal);
                                    text.Span("No Organisms Detected");
                                });
                            });
            });
        }

                    
                    foreach (var item in _model.Pathogens)
                    {
                        column.Item().PaddingTop(10).Row(row =>
                        {

                            row.RelativeItem(42).PaddingTop(13).AlignLeft().Column(column =>
                            {
                                column.Item().Text(formattedText =>
                                {
                                    formattedText.Span("Panel ", TypographyFonts.IDStandardHeadingBlack);
                                    formattedText.Span(item.PanelName, TypographyFonts.IDStandardHeading);
                                });

                            });
                            row.RelativeItem(3).PaddingTop(14).AlignLeft().Column(column =>
                            {
                                column.Item().Text(" ");

                            });
                            row.RelativeItem(16).PaddingTop(13).AlignLeft().Column(column =>
                            {
                                column.Item().Text(text =>
                                {
                                    text.DefaultTextStyle(TypographyFonts.IDStandardContentHeaderBlack);
                                    text.Span("Low (10 - 10 copies/mL)");
                                });

                            });
                            row.RelativeItem(19).AlignLeft().Column(column =>
                            {
                                column.Item().Text(text =>
                                {
                                    //text.AlignCenter();
                                    text.DefaultTextStyle(TypographyFonts.IDStandardContentHeaderBlack);
                                    text.Span("Est. copies/mL Medium(10 - 10 copies/mL)");
                                });

                            });
                            row.RelativeItem(20).PaddingTop(13).AlignLeft().Column(column =>
                            {
                                column.Item().Text(text =>
                                {
                                    //text.AlignCenter();
                                    text.DefaultTextStyle(TypographyFonts.IDStandardContentHeaderBlack);
                                    text.Span("High (10 - 10 copies/mL)");
                                });
                            });


                        });
                        column.Item().BorderBottom(1).Row(row =>
                        {


                            row.RelativeItem(45).PaddingTop(15).AlignLeft().Column(column =>
                            {
                                column.Item().Text(text =>
                                {
                                    //text.AlignCenter();
                                    text.DefaultTextStyle(TypographyFonts.WoundHeadline);
                                    text.Span("Organism Detected").Bold();
                                });

                            });
                            row.RelativeItem(16).PaddingTop(15).AlignLeft().Column(column =>
                            {
                                column.Item().Text(text =>
                                {
                                    //text.AlignCenter();
                                    text.DefaultTextStyle(TypographyFonts.WoundHeadline);
                                    text.Span("Results");
                                });
                            });

                            row.RelativeItem(19).AlignLeft().Column(column =>
                            {
                                column.Item().Text(text =>
                                {
                                    //text.AlignCenter();
                                    text.DefaultTextStyle(TypographyFonts.WoundHeadline);
                                    text.Span("Qualitative (High / Medium / Low");
                                });
                            });
                            row.RelativeItem(20).PaddingTop(15).AlignLeft().Column(column =>
                            {
                                column.Item().Text(text =>
                                {
                                    //text.AlignCenter();
                                    text.DefaultTextStyle(TypographyFonts.WoundHeadline);
                                    text.Span("Est. Copies/mL");
                                });
                            });


                        });
                        if (item.PositivePathogensList.Count() > 0)
                        {
                            foreach (var temp in item.PositivePathogensList)
                            {
                                column.Item().Row(row =>
                                {

                                    row.RelativeItem(45).AlignLeft().Column(column =>
                                    {
                                        column.Item().Text(text =>
                                        {
                                            //text.AlignCenter();
                                            text.DefaultTextStyle(TypographyFonts.IDStandardContentNormalDanger);
                                            text.Span(temp.pathogenName).Bold();
                                        });

                                    });
                                    row.RelativeItem(16).AlignLeft().Column(column =>
                                    {
                                        column.Item().Text(text =>
                                        {
                                            //text.AlignCenter();
                                            text.DefaultTextStyle(TypographyFonts.IDStandardContentNormalDanger);
                                            text.Span(temp.Results);
                                        });
                                    });
                                    row.RelativeItem(19).AlignLeft().Column(column =>
                                    {
                                        column.Item().Text(text =>
                                        {
                                            //text.AlignCenter();
                                            text.DefaultTextStyle(TypographyFonts.IDStandardContentNormalDanger);
                                            text.Span(temp.Qualitative);
                                        });
                                    });
                                    row.RelativeItem(20).AlignLeft().Column(column =>
                                    {
                                        column.Item().Text(text =>
                                        {
                                            //text.AlignCenter();
                                            text.DefaultTextStyle(TypographyFonts.IDStandardContentNormalDanger);
                                            text.Span(temp.EstMicrobialLoad);
                                        });
                                    });


                                });
                            }
                        }
                        else
                        {
                            column.Item().Row(row =>
                            {


                                row.RelativeItem().AlignCenter().Column(column =>
                                {
                                    column.Item().Text(text =>
                                    {
                                        //text.AlignCenter();
                                        text.DefaultTextStyle(TypographyFonts.IDStandardContentNormal);
                                        text.Span("No Organisms Detected");
                                    });

                                });
                            });

                        }


                    }

                    column.Item().DefaultTextStyle(TypographyFonts.IDStandardHeadingBlack).Text("Not Detected Tested Assay Results");
                    column.Item().Text(formattedText =>
                    {
                        formattedText.Span("Panel ", TypographyFonts.IDStandardHeadingBlack);
                        formattedText.Span("Antitbiotic Resistance", TypographyFonts.IDStandardHeading);
                    });
                    column.Item().Border(1).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        table.Cell().Border(1).PaddingLeft(3).DefaultTextStyle(TypographyFonts.IDStandardContentNormalBold).Text("Resistance Gene(s)");
                        table.Cell().Border(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text("");
                        table.Cell().Border(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text("");
                        table.Cell().Border(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text("");
                        foreach (var item in _model.NegativeResistances)
                        {
                            table.Cell().Border(1).PaddingLeft(2).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text(item);
                        }

                        //table.Cell().Border(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text("Date Collected: ");
                        //table.Cell().Border(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text("Date Received: ");
                        //table.Cell().Border(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text("Date Resulted: ");


                    });

                    foreach (var item in _model.Pathogens)
                    {
                        column.Item().Text(formattedText =>
                        {
                            formattedText.Span("Panel ", TypographyFonts.IDStandardHeadingBlack);
                            formattedText.Span(item.PanelName, TypographyFonts.IDStandardHeading);
                        });

                        column.Item().Border(1).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            table.Cell().Border(1).PaddingLeft(3).DefaultTextStyle(TypographyFonts.IDStandardContentNormalBold).Text("Organism");
                            table.Cell().Border(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text("");
                            table.Cell().Border(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text("");
                            table.Cell().Border(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text("");

                            foreach (var temp in item.NegativePathogensForId)
                            {
                                table.Cell().Border(1).PaddingLeft(2).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text(temp);

                            }
                            //table.Cell().Border(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text("Date Collected: ");
                            //table.Cell().Border(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text("Date Received: ");
                            //table.Cell().Border(1).PaddingLeft(1).DefaultTextStyle(TypographyFonts.IDStandardContentNormal).Text("Date Resulted: ");


                        });

                    }
                    column.Item().PaddingTop(5).Row(row =>
                    {
                        row.RelativeItem(100).Padding(3).DefaultTextStyle(TypographyFonts.IDStandardDisclaimerNormal).Text("This test performed by");

                    });
                    column.Item().PaddingTop(5).Row(row =>
                    {
                        row.RelativeItem(100).Padding(3).DefaultTextStyle(TypographyFonts.IDStandardDisclaimerNormal).Text("Limitations:This test only detects microorganisms and antibiotic resistance " +
                            "(ABR) genes specified in the panel. ABR genes are detected in the specimen and are not specific to a detected pathogen. ABR genes me be detected in bacterial strains not tested for the panel.");

                    });
                    column.Item().PaddingTop(5).Row(row =>
                    {
                        row.RelativeItem(100).Padding(3).DefaultTextStyle(TypographyFonts.IDStandardDisclaimerNormal).Text("Disclaimer: This test was developed and its performance characteristics determined by                                   It has not " +
                            "been cleared or approved by the FDA. The laboratory isregulated under CLIA as qualified to perform high complexity testing. This test is used for clinical purposes. It should not be regarded " +
                            "as investigational or for research. The treatmentguidance listed in the report is based on infectious disease treatment references," +
                            " the organisms detected, and genes known to contribute to medication resistance. Important clinicalinformation such as comorbidities, renal function, patient weight, platelet count, microbiology " +
                            "results, etc. may influence the overall appropriateness of therapy. The provided guidance onlytakes drug allergies into account when they are provided and available to the pharmacist making the recommendation." +
                            " The overall appropriateness of therapy must be determined by thephysician treating the patient. The provider has all the patient information necessary to make that determination and should take " +
                            "the entire clinical presentation into account when makingtreatment decisions. Should the treating physician wish to discuss the provided guidance, the pharmacist is available for consult at the " +
                            "email and phone number provided.");

                    });

            });
        }
    }
}
