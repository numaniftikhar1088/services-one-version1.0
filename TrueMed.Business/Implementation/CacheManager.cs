using Newtonsoft.Json;
using StackExchange.Redis;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Response;

namespace TrueMed.Business.Implementation
{
    public class CacheManager : ICacheManager
    {
        private readonly ConnectionMultiplexer _connection;
        private readonly IDatabase _redisDatabase;
        public CacheManager()
        {
            var configOptions = ConfigurationOptions.Parse(System.Web.HttpUtility.UrlDecode(ConfigurationKeys.REDIS_CONNECTION_STRING ?? ""));
            configOptions.AsyncTimeout = 900000;
            configOptions.SyncTimeout = 900000;
            _connection = ConnectionMultiplexer.Connect(configOptions);
            _redisDatabase = _connection.GetDatabase();
        }
        public async Task<RedisCacheResponse<T>> GetAsync<T>(string key)
        {
            var redisResponse = new RedisCacheResponse<T>();

            var isKeyExist = IsKeyExist(key);
            if (isKeyExist)
            {
                var getJsonFromCache = await _redisDatabase.StringGetAsync(key);
                if (getJsonFromCache.HasValue)
                {
                    var convertJsonToObject = JsonConvert.DeserializeObject<T>(getJsonFromCache);
                    redisResponse.IsSuccess = true;
                    redisResponse.Value = convertJsonToObject;
                    return redisResponse;
                }
            }

            redisResponse.IsSuccess = false;
            redisResponse.Message = $"Key ID : {key} is not Exist...";
            return redisResponse;
        }
        public async Task<RedisCacheResponse> SetAsync<T>(string key, T value)
        {
            var redisResponse = new RedisCacheResponse();

            if (_connection.IsConnected)
            {
                var isKeyExist = IsKeyExist(key);
                if (isKeyExist)
                {
                    redisResponse.IsSuccess = false;
                    redisResponse.Message = "Key is already Exist...";
                    return redisResponse;
                }
                var convertToJson = JsonConvert.SerializeObject(value);
                if (!string.IsNullOrEmpty(convertToJson))
                {
                    var isSaved = await _redisDatabase.StringSetAsync(key, convertToJson);
                    if (isSaved)
                    {
                        redisResponse.IsSuccess = true;
                        redisResponse.Message = "Value Stored...";
                        return redisResponse;
                    }
                }
            }
            redisResponse.IsSuccess = false;
            redisResponse.Message = "Something Wrong...";
            return redisResponse;
        }
        public async Task<RedisCacheResponse> ClearAsync(string key)
        {
            var response = new RedisCacheResponse();
            var isCleared = await _redisDatabase.KeyDeleteAsync(key);
            if (isCleared)
            {
                response.IsSuccess = true;
                response.Message = "Cache Cleared...";
            }
            else
            {
                response.IsSuccess = false;
                response.Message = "Something Wrong...";
            }
            return response;
        }

        public RedisCacheResponse Set<T>(string key, T value)
        {
            var redisResponse = new RedisCacheResponse();

            if (_connection.IsConnected)
            {
                var isKeyExist = IsKeyExist(key);
                if (isKeyExist)
                {
                    redisResponse.IsSuccess = false;
                    redisResponse.Message = "Key is already Exist...";
                    return redisResponse;
                }
                var convertToJson = JsonConvert.SerializeObject(value);
                if (!string.IsNullOrEmpty(convertToJson))
                {
                    var isSaved = _redisDatabase.StringSet(key, convertToJson);
                    if (isSaved)
                    {
                        redisResponse.IsSuccess = true;
                        redisResponse.Message = "Value Stored...";
                        return redisResponse;
                    }
                }
            }
            redisResponse.IsSuccess = false;
            redisResponse.Message = "Something Wrong...";
            return redisResponse;
        }
        public RedisCacheResponse<T> Get<T>(string key)
        {
            var redisResponse = new RedisCacheResponse<T>();

            var isKeyExist = IsKeyExist(key);
            if (isKeyExist)
            {
                var getJsonFromCache = _redisDatabase.StringGet(key);
                if (getJsonFromCache.HasValue)
                {
                    var convertJsonToObject = JsonConvert.DeserializeObject<T>(getJsonFromCache);
                    redisResponse.IsSuccess = true;
                    redisResponse.Value = convertJsonToObject;
                    return redisResponse;
                }
            }

            redisResponse.IsSuccess = false;
            redisResponse.Message = $"Key ID : {key} is not Exist...";
            return redisResponse;
        }
     


        #region SOME_PRIVATE_METHODS
        private bool IsKeyExist(string key)
        {
            bool IsExist = _redisDatabase.KeyExists(key);
            if (IsExist)
                return true;
            else
                return false;
        }
        #endregion
    }
}
