using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.ReportingServer.Business.ReportComponents.IDStandardComponents;
using TrueMed.ReportingServer.Business.ReportHelpers;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business.ReportTemplates
{
    public class IDStandardReport : IDocument
    {
        private readonly IDStandardDataModel _model;

        public IDStandardReport(IDStandardDataModel iDStandardDataModel)
        {
            _model = iDStandardDataModel;
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

             page.Size(PageSizes.A4);
             page.PageColor(Colors.White);
             // header 
             //      StandardRPPReportHeaderComponent.
             page.Header().Column(column =>
             {
                 column.Item().Component(new IDStandardReportHeaderComponent(_model.Header));
             });


             page.Content().PaddingVertical(10).Column(column =>
             {
                 column.Item().Component(new IDStandardReportContentComponent(_model.Content));
             });

             page.Footer().Column(column =>
             {


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
