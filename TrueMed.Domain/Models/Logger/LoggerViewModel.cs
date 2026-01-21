using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.Domain.Model.Logger
{
    public class LogViewModel
    {
        public string? LogId { get; set; }
        public string? Title { get; set; }
        public LogType LogType { get; set; }
        public string? Message { get; set; }
        public bool IsProcessed { get; set; }
        public Status Status { get; set; }
        public DateTime CreateDate { get; set; }
    }

    public class LogWithExtentionDataViewModel : LogViewModel
    {
        public object? ExtentionData { get; set; }
    }

    public enum LogType
    {
        BulkProcessing = 0,

        Information = 1,

        Warnning = 2,

        //e.g error or some critical error
        Critical = 3
    }
}
