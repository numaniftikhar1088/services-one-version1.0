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
    public class WoundPositiveReportContentComponent : IComponent
    {
        private readonly WoundPositiveContentDataModel _model;

        public WoundPositiveReportContentComponent(WoundPositiveContentDataModel model)
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


                    row.RelativeItem(12).PaddingLeft(15).AlignLeft().Column(column =>
                    {
                        column.Item().Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.WoundContentHeader);
                            text.Span("Results:");
                        });

                    });
                    row.RelativeItem(37).AlignLeft().Column(column =>
                    {
                        column.Item().Text(text =>
                        {
                            //text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.WoundContentHeaderDanger);
                            text.Span("Detected".ToUpper());
                        });

                    });
                    row.RelativeItem(55).AlignLeft().Column(column =>
                    {
                        column.Item().Row(row =>
                        {
                            row.RelativeItem(5).Text(text =>
                            {
                                //text.AlignCenter();
                                text.DefaultTextStyle(TypographyFonts.WoundContentHeaderBlack);
                                text.Span("Specimen Type:");
                            });
                            row.RelativeItem(10).Text(text =>
                            {
                                //text.AlignCenter();
                                text.DefaultTextStyle(TypographyFonts.WoundContentHeaderBlackItalic);
                                text.Span("Left shoulder, Ulcer");
                            });
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

                column.Item().PaddingTop(10).Row(row =>
                {
                    row.Spacing(10);
                    row.RelativeItem(40).ShowOnce().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().BorderTop(1).BorderBottom(1).PaddingTop(1).PaddingBottom(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentHeader).Text("Pathogens Detected".ToUpper());
                        });
                        table.Cell().PaddingTop(2).PaddingBottom(2).PaddingLeft(10).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });
                            table.Cell().BorderBottom(1).PaddingTop(7).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Organism(s)");
                            table.Cell().BorderBottom(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Estimated \r\nMicrobial load");
                            table.Cell().BorderBottom(1).PaddingTop(7).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Estimated Cp/mL");

                            foreach (var item in _model.PositivePathgons)
                            {
                                table.Cell().BorderBottom(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBoldDanger).Text(item.pathogenName);
                                table.Cell().BorderBottom(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBoldDanger).Text(item.Qualitative);
                                table.Cell().BorderBottom(1).PaddingTop(7).DefaultTextStyle(TypographyFonts.WoundContentNormalBoldDanger).Text(item.EstMicrobialLoad);
                            }


                        });

                    });

                    row.RelativeItem(40).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().BorderTop(1).BorderBottom(1).PaddingTop(1).PaddingBottom(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentHeader).Text("Resistance Genes Detected".ToUpper());
                        });

                        table.Cell().PaddingTop(2).PaddingBottom(10).PaddingLeft(50).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });
                            table.Cell().BorderBottom(1).PaddingBottom(10).PaddingTop(7).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Gene(s)");
                            table.Cell().BorderBottom(1).PaddingTop(7).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Description");
                            foreach (var item in _model.PositiveResistances)
                            {
                                table.Cell().PaddingTop(7).BorderBottom(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBoldDanger).Text(item.TestName);
                                table.Cell().PaddingTop(7).BorderBottom(1).DefaultTextStyle(TypographyFonts.WoundContentNormalBoldDanger).Text(item.AntibioticClass);
                            }

                        });



                    });

                });

                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });
                    table.Header(header =>
                    {
                        header.Cell().PaddingLeft(6).PaddingTop(1).PaddingBottom(4).DefaultTextStyle(TypographyFonts.WoundContentHeader).Text("Tested Pathogen(s):");
                    });
                    table.Cell().Border(1).PaddingLeft(12).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Tested Targets");
                    table.Cell().Border(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Results");
                    table.Cell().Border(1).PaddingLeft(12).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Tested Targets");
                    table.Cell().Border(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Results");

                    foreach (var item in _model.NegativePathogens)
                    {
                        table.Cell().Border(1).PaddingLeft(8).DefaultTextStyle(TypographyFonts.WoundContentNormal).Text(item.TestName);
                        table.Cell().Border(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentNormal).Text(item.Result.ToUpper());
                    }

                    table.Cell().Border(1).PaddingLeft(8).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("QC Control");
                    table.Cell().Border(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Pass");


                });
                column.Item().PaddingTop(10).Border(1).Row(row =>
                {
                    row.Spacing(10);
                    row.RelativeItem(40).ShowOnce().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(3);
                            columns.RelativeColumn(3);
                            columns.RelativeColumn(2);
                        });

                        table.Header(header =>
                        {
                            header.Cell().BorderTop(1).BorderBottom(1).PaddingTop(1).PaddingLeft(6).PaddingBottom(1).DefaultTextStyle(TypographyFonts.WoundContentHeader).Text("Resistance Gene Markers");
                        });
                        table.Cell().Border(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Resistance Type");
                        table.Cell().Border(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Gene(s)");
                        table.Cell().Border(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Result");
                        //table.Cell().Border(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Results");

                        foreach (var item in _model.NegativeResistances)
                        {
                            table.Cell().Border(1).PaddingLeft(8).DefaultTextStyle(TypographyFonts.WoundContentNormal).Text(item.AntibioticClass);
                            table.Cell().Border(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentNormal).Text(item.TestName);
                            table.Cell().Border(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentNormal).Text(item.Result.ToUpper());
                        }

                        //table.Cell().Border(1).PaddingLeft(12).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("QC Control");
                        //table.Cell().Border(1).AlignCenter().DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Pass");

                        //foreach (var item in _content.NegativePathogens.ToList())
                        //    table.Cell().DefaultTextStyle(TypographyFonts.ContentNormal).Text(item);


                    });



                });
                column.Item().Row(row =>
                {
                    row.RelativeItem(100).PaddingLeft(5).DefaultTextStyle(TypographyFonts.WoundContentHeaderBlack).Text("Methodology");

                });
                column.Item().Row(row =>
                {
                    row.RelativeItem(100).Padding(3).DefaultTextStyle(TypographyFonts.WoundContentNormal).Text("Real-Time PCR was performed on genomic DNA extractions using TaqMan Array Cards, analyzed on QuantStudio™ 12K Flex Platform. Data " +
                        "obtained for each assay to detect species \r\nspecific sequences within each sample, during amplification, sequence specific oligonucleotides probes hybridize to a specific DNA template. The Applied Biosystems™ " +
                        "QuantStudio™ \r\n12K Flex system analyzing software provides qualitative results based upon whether the amplification is above or below the threshold of detection. The test uses different sets of quality \r\ncontrols.");

                });
                column.Item().Row(row =>
                {
                    row.RelativeItem(100).PaddingLeft(5).DefaultTextStyle(TypographyFonts.WoundContentHeaderBlack).Text("General Comments & Additional Information");

                });
                column.Item().Row(row =>
                {
                    row.RelativeItem(100).Padding(3).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text("The test was performed, and its performance characteristics were validated by . The test is not FDA approved. " +
                        "The test is a qualitative nucleic acid multiplex diagnostic test intended \r\nuse for the detection and identification of specific pathogens from individuals exhibiting signs of wound Infections." +
                        " The test aids in the diagnosis if used in conjunction with other clinical \r\nand epidemiological information.  \r\n \r\nA \"Detected\" result indicates the presence of a pathogen (99.99% confidence) " +
                        "above the assay cutoff. Negative results do not preclude the wound infection and should not be used as \r\nthe sole basis for diagnosis, treatment, or other patient management decisions. Positive results do " +
                        "not rule out infection, or co-infection with other pathogens not on our panel. The \r\npathogen(s) detected may not be the definite cause of disease. Detection of a marker of antibiotic resistance does not preclude " +
                        "other antibiotic resistance mechanisms not tested for \r\nin the panel. Positive detection of an antibiotic resistance marker only indicates that marker is present in the flora in the sample tested and may " +
                        "not indicate potential for use in WPP. \r\n \r\nAn absence of detection does not imply the absence of microorganisms other than those listed and/or does not exclude the possibility that the target sequence is " +
                        "present below the \r\nlimit of detection. While these assays are sensitive, theoretically, these assays could detect pathogens not listed, resulting in a false positive. In addition, while these assays are highly " +
                        "\r\nspecific, there may be target pathogen sequences with unknown sequence variability which may not be detected, resulting in a false negative result. \r\n \r\nThe pathogens identified using  this wound infection " +
                        " test is listed  in the above  table with clinical significance  and analytical sensitivity  and specificity greater  than 99%. Absence  of \r\ndetection does not imply the absence of microorganisms other than those" +
                        " listed and/or does not exclude the possibility that the target sequence is present below the limit of detection. \r\nWhile these assays are sensitive, theoretically, these assays could detect pathogens not listed, " +
                        "resulting in a false positive. In addition, while these assays are highly specific, there \r\nmay be target pathogen sequences with unknown sequence variability which may not be detected, resulting in a false negative " +
                        "result. \r\n \r\nThe final  report does  not  take  into consideration patient  history, drug-drug  interactions, drug  sensitivity,  and/or  allergies. The  information  contained  in  this  report  is  intended  to " +
                        "be \r\ninterpreted by a licensed physician or other licensed healthcare professional. This report is not intended to take the place of professional medical advice. Decisions regarding use of \r\nprescribed medications " +
                        "must be made only after consulting with a licensed physician or other licensed healthcare professional, and appropriate drug and dosing choices should consider \r\neach patient's medical history, and current treatment regimen.  \r\n \r\nApproved by");

                });
            });


        }
    }
}
