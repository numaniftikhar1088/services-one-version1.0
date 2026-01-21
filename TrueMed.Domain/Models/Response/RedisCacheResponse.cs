namespace TrueMed.Domain.Models.Response
{
    public class RedisCacheResponse<T>
    {
        public string? Message { get; set; }
        public bool IsSuccess { get; set; }
        public T Value { get; set; }
    }
    public class RedisCacheResponse : RedisCacheResponse<object>
    {
    }
}
