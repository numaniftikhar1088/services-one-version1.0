using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.ReportingServer.Business.ReportComponents.WoundPositiveComponents;
using TrueMed.ReportingServer.Business.ReportHelpers;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business.ReportTemplates
{
    public class WoundPositiveReport : IDocument
    {
        private readonly WoundPositiveDataModel _model;
        public WoundPositiveReport(WoundPositiveDataModel model)
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
                    column.Item().Component(new WoundPositiveReportHeaderComponent(_model.Header));
                });


                page.Content().PaddingVertical(10).Column(column =>
                {
                    column.Item().Component(new WoundPositiveReportContentComponent(_model.Content));


                });

                page.Footer().Column(column => {


                    //  column.Item().Component(new StandardRPPReportFooterComponent());



                    column.Item().AlignCenter().Text(text =>
                    {
                        text.DefaultTextStyle(TextStyle.Default.Size(16));

                        text.CurrentPageNumber();
                        text.Span(" / ");
                        text.TotalPages();
                    });
                });






            });
        }
    }
}
