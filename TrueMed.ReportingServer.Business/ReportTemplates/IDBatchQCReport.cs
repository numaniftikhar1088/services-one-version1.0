using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.ReportingServer.Business.ReportComponents.IDBatchQCReportComponents;
using TrueMed.ReportingServer.Business.ReportHelpers;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business.ReportTemplates
{
    public class IDBatchQCReport :IDocument
    {
        private readonly IDBatchQCDataViewModel _model;
        public IDBatchQCReport(IDBatchQCDataViewModel model)
        {
            _model = model;
            foreach (var path in Directory.GetFiles(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Fonts")))
            {

                QuestPDF.Drawing.FontManager.RegisterFont(File.OpenRead(path));
            }
        }
        public void Compose(IDocumentContainer container)
        {
            container
            .Page(page =>
            {
                page.DefaultTextStyle(TypographyFonts.Normal);
                page.Margin(15);
                page.MarginLeft(22);
                page.MarginRight(30);

                page.Size(PageSizes.Letter);
                page.PageColor(Colors.White);
                // header 
                //      StandardRPPReportHeaderComponent.
                page.Header().Column(column =>
                {
                    column.Item().Component(new IDBatchQCHeaderComponent(_model.Header));
                });


                page.Content().PaddingVertical(10).Column(column =>
                {
                    column.Item().Component(new IDBatchQCContentComponent(_model.Content));


                });

                //page.Footer().Column(column => {


                //    //  column.Item().Component(new StandardRPPReportFooterComponent());



                //    column.Item().AlignCenter().Text(text =>
                //    {
                //        text.DefaultTextStyle(TextStyle.Default.Size(16));

                //        text.CurrentPageNumber();
                //        text.Span(" / ");
                //        text.TotalPages();
                //    });
                //});
            });
        }
    }
}
