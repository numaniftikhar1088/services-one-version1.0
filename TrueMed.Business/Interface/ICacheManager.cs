using TrueMed.Domain.Models.Response;

namespace TrueMed.Business.Interface
{
    public interface ICacheManager
    {
        Task<RedisCacheResponse> SetAsync<T>(string key, T value);
        Task<RedisCacheResponse<T>> GetAsync<T>(string key);
        Task<RedisCacheResponse> ClearAsync(string key);
        RedisCacheResponse Set<T>(string key, T value);
        RedisCacheResponse<T> Get<T>(string key);
    }
}
