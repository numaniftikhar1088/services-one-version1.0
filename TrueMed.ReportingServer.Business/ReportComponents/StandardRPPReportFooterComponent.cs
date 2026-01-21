using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.ReportingServer.Business
{
    public class StandardRPPReportFooterComponent : IComponent
    {
        public void Compose(IContainer container)
        {


            container.Column(column =>
            {
                column.Item().AlignCenter().PaddingTop(10).Width(550).LineHorizontal(2).LineColor("#5ab7c3");



            });


        }
    }
}
