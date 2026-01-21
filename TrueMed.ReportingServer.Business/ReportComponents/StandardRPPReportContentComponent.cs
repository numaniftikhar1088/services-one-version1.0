using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.ReportingServer.Business.ReportHelpers;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business
{
    public class StandardRPPReportContentComponent : IComponent
    {
        private StandardRppContent _content;
        public StandardRPPReportContentComponent(StandardRppContent content)
        {
            _content = content;
        }
        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                column.Spacing(5);
                column.Item().Row(row =>
                {
                    row.RelativeItem(30).DefaultTextStyle(TypographyFonts.Header).Text("Comments");
                    row.RelativeItem(300).DefaultTextStyle(TypographyFonts.Normal).Text(_content.Comments);

                });


                column.Item().Background("#ff8080").DefaultTextStyle(TypographyFonts.ContentTitle).Padding(5).Text(" Positive Pathogen(s)");
                column.Item().Column(pnlcolumn =>
                {
                    column.Spacing(5);
                    foreach (var pnl in _content.PositivePathgons)
                    {
                        pnlcolumn.Item().PaddingTop(5).DefaultTextStyle(TypographyFonts.ContentHeader).Text(pnl.PanelName);
                        foreach (var pat in pnl.Pathogens.ToList())
                        {
                            pnlcolumn.Item().Row(row =>
                            {
                                row.Spacing(5);
                                row.RelativeItem(80).Background("#edf4f4").PaddingLeft(5).DefaultTextStyle(TypographyFonts.ContentDangerNormal).Text(pat.PathogenName);

                                row.RelativeItem(20).Background("#edf4f4").PaddingLeft(5).DefaultTextStyle(TypographyFonts.ContentDangerNormal).Text(pat.pathogeResult);
                            });

                        }



                    }
                });

                column.Item().PaddingTop(10).Row(row =>
                {
                    row.Spacing(20);
                    row.RelativeItem(40).ShowOnce().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background("#518f94").PaddingTop(5).PaddingBottom(5).AlignCenter().DefaultTextStyle(TypographyFonts.ContentTitle).Text("Negative Pathogen Gene(s)");
                        });
                        foreach (var item in _content.NegativePathogens.ToList())
                            table.Cell().DefaultTextStyle(TypographyFonts.ContentNormal).Text(item);


                    });

                    row.RelativeItem(40).ShowOnce().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background("#7d78b8").PaddingTop(5).PaddingBottom(5).AlignCenter().DefaultTextStyle(TypographyFonts.ContentTitle).Text("Negative Resistance Gene(s)");
                        });


                      
                        foreach (var item in _content.NegativeResistances.ToList())
                            table.Cell().DefaultTextStyle(TypographyFonts.ContentNormal).Text(item);


                    });

                });

               




            });
        }
    }
}
