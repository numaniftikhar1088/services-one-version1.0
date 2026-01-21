using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.ReportingServer.Business.ReportHelpers;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business.ReportComponents.RequisitionOrderViewComponents
{
    public class RequisitionOrderViewMainComponent : IComponent
    {
        private readonly ReqOrderViewResponse _model;

        public RequisitionOrderViewMainComponent(ReqOrderViewResponse component)
        {
            _model = component;
        }
        public void Compose(IContainer container)
        {
            container.Column(column =>
            {
                column.Spacing(1);

                foreach (var item in _model.Sections)
                {

                    if (item.SectionDisplayName != "Files" && item.SectionDisplayName != "Physician Signature" && item.SectionDisplayName != "Patient Signature")
                    {

                        column.Item().Background("#dcebd5").PaddingLeft(15).DefaultTextStyle(TypographyFonts.CalibriContentHeader).Text(item.SectionDisplayName);
                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });
                            foreach (var field in item.Fields)
                            {

                                table.Cell().PaddingLeft(12).DefaultTextStyle(TypographyFonts.CalibriHeader).Text(field.FieldName);
                                string fieldValue = Convert.ToString(field.FieldValue);

                                table.Cell().PaddingLeft(12).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(fieldValue);



                            }

                        });
                        if (item.Requistions != null && item.Requistions.Count() > 0)
                        {
                            foreach (var req in item.Requistions)
                            {

                                foreach (var section in req.Sections)
                                {
                                    column.Item().Padding(12).Background("#dcebd5").PaddingLeft(15).DefaultTextStyle(TypographyFonts.CalibriContentHeader).Text(section.SectionDisplayName);
                                    column.Item().Table(table =>
                                    {
                                        table.ColumnsDefinition(columns =>
                                        {
                                            columns.RelativeColumn();
                                            columns.RelativeColumn();
                                            columns.RelativeColumn();
                                            columns.RelativeColumn();
                                        });
                                        foreach (var temp in section.Fields)
                                        {
                                            if (temp.FieldName == "Collection")
                                            {
                                                string fieldValue = Convert.ToString(temp.FieldValue);
                                                var obj = JsonConvert.DeserializeObject<List<Root>>(fieldValue);
                                                if (obj != null)
                                                {
                                                    foreach (var s in obj)
                                                    {

                                                        table.Cell().PaddingLeft(17).DefaultTextStyle(TypographyFonts.CalibriHeader).Text("Specimen Type");
                                                        table.Cell().PaddingLeft(17).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(s.specimenType);
                                                        table.Cell().PaddingLeft(17).DefaultTextStyle(TypographyFonts.CalibriHeader).Text("Accession No");
                                                        table.Cell().PaddingLeft(17).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(s.accessionNo);

                                                    }

                                                }


                                            }
                                            else if (temp.SystemFieldName == "ICDPanels")
                                            {
                                                string fieldValue = Convert.ToString(temp.FieldValue);
                                                var obj = JsonConvert.DeserializeObject<List<ICD>>(fieldValue);
                                                if (obj != null)
                                                {
                                                    table.ColumnsDefinition(column =>
                                                    {
                                                        column.RelativeColumn();
                                                    });
                                                    table.Cell().PaddingLeft(17).PaddingRight(17).PaddingBottom(3).Border(1).BorderColor("#d7dae7").Table(table =>
                                                    {
                                                        table.ColumnsDefinition(columns =>
                                                        {
                                                            columns.RelativeColumn(17);
                                                            columns.RelativeColumn(83);
                                                        });
                                                        table.Cell().Background("#e9eef4").PaddingLeft(3).BorderColor("#d7dae7").BorderRight(1).DefaultTextStyle(TypographyFonts.CalibriHeader).Text("Icd 10 codes");
                                                        table.Cell().Background("#e9eef4").PaddingLeft(3).DefaultTextStyle(TypographyFonts.CalibriHeader).Text("Descriptions");

                                                        foreach (var s in obj)
                                                        {
                                                            table.Cell().PaddingLeft(5).BorderColor("#d7dae7").BorderRight(1).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(s.code);
                                                            table.Cell().PaddingLeft(3).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(s.description);

                                                        }
                                                    });

                                                }


                                            }
                                            else if(temp.SystemFieldName == "ICD10Description")
                                            {

                                            }
                                            else if(temp.SystemFieldName == "ICD10Code")
                                            {

                                            }
                                            else if (temp.SystemFieldName == "DrugAllergies")
                                            {
                                                string fieldValue = Convert.ToString(temp.FieldValue);
                                                var obj = JsonConvert.DeserializeObject<List<string>>(fieldValue);
                                                if (obj != null)
                                                {
                                                    foreach (var s in obj)
                                                    {

                                                        table.Cell().Padding(3).AlignCenter().Background("#e4e6ef").DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(" " + s + " ").Bold();

                                                    }

                                                }
                                            }
                                            else if (temp.SystemFieldName == "ExperiencingSymptom" || temp.SystemFieldName == "NoSymptom")
                                            {
                                                table.Cell().PaddingLeft(17).Padding(3).DefaultTextStyle(TypographyFonts.CalibriHeader).Text(temp.FieldName);
                                                string fieldValue = Convert.ToString(temp.FieldValue);
                                                var obj = JsonConvert.DeserializeObject<List<Resp>>(fieldValue);
                                                if (obj != null)
                                                {
                                                    foreach (var s in obj)
                                                    {

                                                        table.Cell().PaddingLeft(12).Padding(3).PaddingRight(12).Background("#e4e6ef").DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(" " + s.value + " ").Bold();

                                                    }

                                                }
                                            }
                                            else if (temp.SystemFieldName == "Compendium")
                                            {
                                                string fieldValue = Convert.ToString(temp.FieldValue);
                                                var obj = JsonConvert.DeserializeObject<List<Compendium>>(fieldValue);
                                                if (obj != null)
                                                {
                                                    foreach (var s in obj)
                                                    {
                                                        foreach (var test in s.testingOptions)
                                                        {
                                                            table.Cell().PaddingLeft(15).Padding(2).PaddingRight(12).Background("#e4e6ef").AlignCenter().DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(" " + test + " ").Bold();
                                                        }


                                                    }

                                                }
                                            }
                                            else
                                            {
                                                table.Cell().PaddingLeft(17).DefaultTextStyle(TypographyFonts.CalibriHeader).Text(temp.FieldName);



                                                string fieldValue = Convert.ToString(temp.FieldValue);
                                                table.Cell().PaddingLeft(17).DefaultTextStyle(TypographyFonts.CalibriContentNormal).Text(fieldValue);
                                            }

                                        }

                                    });
                                }



                            }

                        }

                    }

                }
                var patientSignatureSection = _model.Sections.FirstOrDefault(s => s.SectionDisplayName == "Patient Signature");
                var physicianSignatureSection = _model.Sections.FirstOrDefault(s => s.SectionDisplayName == "Physician Signature");

                if (patientSignatureSection != null && physicianSignatureSection != null)
                {
                    //column.Item().Background("#dcebd5").PaddingLeft(15).DefaultTextStyle(TypographyFonts.CalibriContentHeader).Text("Signature Sections");

                    // Create a row for the signature sections
                    column.Item().Row(signatureRow =>
                    {
                        signatureRow.RelativeItem().Column(leftColumn =>
                        {
                            leftColumn.Item().PaddingRight(1).Background("#dcebd5").PaddingLeft(15).DefaultTextStyle(TypographyFonts.CalibriContentHeader).Text(patientSignatureSection.SectionDisplayName);

                            foreach (var field in patientSignatureSection.Fields)
                            {
                                if (field.SystemFieldName == "PatientSignature")
                                {
                                    string fieldValue = Convert.ToString(field.FieldValue);
                                    var bytes = Convert.FromBase64String(fieldValue);
                                    leftColumn.Item().PaddingRight(1).Background("#e4e6ef").Image(bytes);
                                }
                            }
                        });

                        signatureRow.RelativeItem().Column(rightColumn =>
                        {
                            rightColumn.Item().PaddingLeft(1).Background("#dcebd5").PaddingLeft(15).DefaultTextStyle(TypographyFonts.CalibriContentHeader).Text(physicianSignatureSection.SectionDisplayName);

                            foreach (var field in physicianSignatureSection.Fields)
                            {
                                if (field.SystemFieldName == "PhysicianSignature")
                                {
                                    string fieldValue = Convert.ToString(field.FieldValue);
                                    var bytes = Convert.FromBase64String(fieldValue);
                                    rightColumn.Item().PaddingLeft(1).Background("#e4e6ef").Image(bytes);
                                }
                            }
                        });
                    });
                }



            });
        }
    }
    public class Root
    {
        public string accessionNo { get; set; }
        public string specimenType { get; set; }
    }
    public class ICD
    {
        public string code { get; set; }
        public string description { get; set; }
        public int icd10id { get; set; }
    }
    public class Resp
    {
        public string value { get; set; }
        public string label { get; set; }
    }
    public class Compendium
    {
        public string panelName { get; set; }
        public List<string> testingOptions { get; set; }

    }
}
