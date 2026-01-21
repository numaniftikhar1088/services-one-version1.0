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
    public class UTIStandardReportHeaderComponent : IComponent
    {
        private readonly StandardUTIHeaderDataModel _model;

        public UTIStandardReportHeaderComponent(StandardUTIHeaderDataModel model)
        {
            _model = model;
        }
        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                column.Spacing(10);
                // logo and title
                column.Item().Row(row =>
                {
                    row.RelativeItem(50).Image(_model.Logo);

                    //row.ConstantItem(400).Text(t => { });
                    //var imagepath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "ReportTemplates/Content/CliaImage.PNG");
                    //row.ConstantItem(150).Height(50).Width(150).Image(imagepath);

                    //row.RelativeItem(10).Text("");
                    row.RelativeItem(40).Column(column =>
                    {
                        column.Item().AlignRight().Text(text =>
                        {
                            text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.CalibriHeadline);
                            text.Span(_model.Title1);
                        });
                        column.Item().AlignRight().Text(text =>
                        {
                            text.AlignCenter();
                            text.DefaultTextStyle(TypographyFonts.CalibriHeadlineGreen);
                            text.Span(_model.Title2);
                        });
                    });


                });
                // patient info

                column.Item().Row(row =>
                {
                    row.Spacing(3);
                    row.RelativeItem(33).Background("#0d9344").AlignCenter().Padding(4).DefaultTextStyle(TypographyFonts.CalibriContentTitle).Text("Patient Name".ToUpper());
                    row.RelativeItem(33).Background("#0d9344").AlignCenter().Padding(4).DefaultTextStyle(TypographyFonts.CalibriContentTitle).Text("Date Of Birth".ToUpper());
                    row.RelativeItem(33).Background("#0d9344").AlignCenter().Padding(4).DefaultTextStyle(TypographyFonts.CalibriContentTitle).Text("Gender".ToUpper());



                });

                column.Item().BorderBottom(1).BorderColor("#0d9344").Row(row =>
                {
                    row.Spacing(3);
                    row.RelativeItem(33).AlignCenter().Padding(3).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(_model.patientName);
                    row.RelativeItem(33).AlignCenter().Padding(3).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(_model.DateOfBirth);
                    row.RelativeItem(33).AlignCenter().Padding(3).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(_model.Gender);

                });


            });


        }
    }
}
