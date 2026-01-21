using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.ReportingServer.Domain.Dtos.Response
{
    public class IDBatchQCDataViewModel
    {
        public IDBatchQCHeaderDataModel Header { get; set; }
        public IDBatchQCContentDataModel Content { get; set; }
    }
    public class IDBatchQCHeaderDataModel
    {
        public byte[] Logo { get; set; }
        public string Title { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string DirectorName { get; set; }
        public string Fax { get; set; }
        public string CLIA { get; set; }
        public int? FileId { get; set; }
        public string? FileName { get; set; }
        public int? PanelId { get; set; }
        public string? PanelName { get; set; }
        public string? CreatedDate { get; set; }
    }
    public class IDBatchQCContentDataModel
    {
        public string? PanelName { get; set; }
        public List<BatchQCControls> Controls { get; set; }
    }
    public class BatchQCControls
    {
        public int Id { get; set; }
        public string? TestName { get; set; }
        public string? Result { get; set; }
        public string? QccontrolName { get; set; }
        public string? Comments { get; set; }
    }
}
