namespace TrueMed.Domain.Models.LookUps.Common
{
    public class CommonLookupResponse<T>
    {
        public T Value { get; set; }
        public string? Label { get; set; }
    }
    public class CommonLookupResponse : CommonLookupResponse<int>
    {
    }
}
