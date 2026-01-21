using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.ReportingServer.Business.ReportHelpers
{
    public static class TypographyFonts
    {
        //public Typography()
        //{
        //    //  FontManager.RegisterFont(File.OpenRead(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Fonts/Quicksand-VariableFont_wght.ttf")));
        //}

        public static TextStyle Title => TextStyle.Default.FontFamily(Fonts.TimesNewRoman).FontColor(Colors.Black).FontSize(26).Black();
        public static TextStyle Headline => TextStyle.Default.FontFamily(Fonts.TimesNewRoman).FontColor(Colors.Black).FontSize(16).SemiBold();
        public static TextStyle Normal => TextStyle.Default.FontFamily(Fonts.TimesNewRoman).FontColor(Colors.Black).FontSize(10).LineHeight(1.2f);
        public static TextStyle Header => TextStyle.Default.FontFamily(Fonts.TimesNewRoman).FontColor(Colors.Black).FontSize(10).LineHeight(1.2f).Bold();
        public static TextStyle PatientHeader => TextStyle.Default.FontFamily(Fonts.TimesNewRoman).FontColor(Colors.White).FontSize(9).SemiBold();

        public static TextStyle ContentTitle => TextStyle.Default.FontFamily(Fonts.TimesNewRoman).FontColor(Colors.White).FontSize(16).Bold();
        public static TextStyle ContentHeader => TextStyle.Default.FontFamily(Fonts.TimesNewRoman).FontColor(Colors.Black).FontSize(15).Bold();
        public static TextStyle ContentDangerNormal => TextStyle.Default.FontFamily(Fonts.TimesNewRoman).FontColor(Colors.Red.Medium).FontSize(11).Bold();
        public static TextStyle ContentNormal => TextStyle.Default.FontFamily(Fonts.TimesNewRoman).FontColor(Colors.Black).FontSize(9);




        public static TextStyle CalibriContentTitle => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.White).FontSize(16).Bold();
        public static TextStyle CalibriContentTitleBlue => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor("#2e679b").FontSize(16).Bold();
        public static TextStyle CalibriContentHeader => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(15).Bold();
        public static TextStyle CalibriContentDangerNormal => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Red.Medium).FontSize(11).Bold();
        public static TextStyle CalibriContentNormal => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(10);


        public static TextStyle CalibriHeadline => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(20);
        public static TextStyle CalibriHeadlineGreen => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor("#0d9344").FontSize(20);
        public static TextStyle CalibriHeader => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(10).LineHeight(1.2f).Bold();
        #region==============================================
        public static TextStyle WoundHeadline => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(12).Bold();
        public static TextStyle WoundHeadlineWhite => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.White).FontSize(12).Bold();
        public static TextStyle WoundContentNormal => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(8);
        public static TextStyle WoundContentNormalBold => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(11).Bold();
        public static TextStyle WoundContentNormalBoldDanger => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Red.Medium).FontSize(11).Bold();
        public static TextStyle WoundContentBold => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(8).Bold();
        public static TextStyle WoundContentHeader => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor("#2e679b").FontSize(13).Bold();
        public static TextStyle WoundContentHeaderBlack => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(13).Bold();
        public static TextStyle WoundContentHeaderBlackItalic => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(13).Bold().Italic();
        public static TextStyle WoundContentHeaderDanger => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Red.Medium).FontSize(13).Bold();


        #endregion===========================================

        public static TextStyle IDStandardHeadingBlack => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(18).Bold();
        public static TextStyle IDStandardHeader => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor("#338582").FontSize(13).Bold();
        public static TextStyle IDStandardHeading => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor("#338582").FontSize(19).Bold();
        public static TextStyle IDStandardContentHeaderBlack => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(13).Bold();
        public static TextStyle IDStandardContentNormal => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(11);
        public static TextStyle IDStandardDisclaimerNormal => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(9);
        public static TextStyle IDStandardContentNormalDanger => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Red.Medium).FontSize(11).Bold();
        public static TextStyle IDStandardContentNormalBold => TextStyle.Default.FontFamily(Fonts.Calibri).FontColor(Colors.Black).FontSize(11).Bold();
    }
}
