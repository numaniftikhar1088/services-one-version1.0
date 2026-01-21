namespace TrueMed.ApiGateway.Model
{
    public class BlobModel
    {
        public string Name { get; set; }
        public string PortalKey { get; set; }

        public string FileType { get; set; }
        public string Extention { get; set; }
        public byte[] Content { get; set; }
        public bool isPubic { get; set; }

    }
}
