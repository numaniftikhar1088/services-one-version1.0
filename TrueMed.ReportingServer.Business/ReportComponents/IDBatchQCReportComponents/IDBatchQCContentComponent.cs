using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.ReportingServer.Business.ReportHelpers;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business.ReportComponents.IDBatchQCReportComponents
{
    public class IDBatchQCContentComponent : IComponent
    {
        private readonly IDBatchQCContentDataModel _model;

        public IDBatchQCContentComponent(IDBatchQCContentDataModel model)
        {
            _model = model;
        }
        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                column.Spacing(5);
                
                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });
                    table.Header(header =>
                    {
                        header.Cell().PaddingLeft(6).PaddingBottom(9).DefaultTextStyle(TypographyFonts.WoundContentBold).Text(_model.PanelName+" Pathogens Tested");
                    });
                    table.Cell().Border(1).PaddingLeft(8).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Pathogens");
                    table.Cell().Border(1).PaddingLeft(8).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Results");
                    table.Cell().Border(1).PaddingLeft(8).DefaultTextStyle(TypographyFonts.WoundContentNormalBold).Text("Comments");

                    foreach (var item in _model.Controls)
                    {
                        table.Cell().Border(1).PaddingLeft(8).DefaultTextStyle(TypographyFonts.WoundContentNormal).Text("["+item.QccontrolName+"] "+item.TestName);
                        table.Cell().Border(1).PaddingLeft(8).DefaultTextStyle(TypographyFonts.WoundContentNormal).Text(item.Result);
                        table.Cell().Border(1).PaddingLeft(8).DefaultTextStyle(TypographyFonts.WoundContentNormal).Text(item.Comments);
                    }


                });
                column.Item().PaddingTop(10).Row(row =>
                {


                    //row.RelativeItem(40).PaddingLeft(5);
                    row.RelativeItem(55).Text("");
                    row.RelativeItem(35).Column(column =>
                    {

                        column.Item().PaddingTop(2).BorderBottom(1).PaddingLeft(8).Text("");
                        column.Item().PaddingTop(5).Text(text =>
                        {
                            text.AlignRight();
                            text.DefaultTextStyle(TypographyFonts.WoundContentBold);
                            text.Span("Signature and Date ");
                        });


                    });


                });


            });


        }
    }
}
