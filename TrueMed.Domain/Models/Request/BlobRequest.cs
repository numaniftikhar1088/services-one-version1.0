namespace TrueMed.Domain.Models.Request
{
    public class BlobRequest
    {
        public string Name { get; set; }
        public string PortalKey { get; set; }
        public string FileType { get; set; }
        public string Extention { get; set; }
        public byte[] Content { get; set; }
    }
}
