using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Helpers.ExtentionData
{
    public class KeyValuePairsData<T> where T : class
    {
        public static T Deserialize(string value)
        {
            return JsonConvert.DeserializeObject<T>(value);
        }
        public static string Serialize(T type)
        {
            return JsonConvert.SerializeObject(type);
        }
    }


    public class ExtentionData
    {
        private readonly string _value;
        public List<KeyValues> KeyValues;
        /// <summary>
        /// ExtentionData format:  [{Key:'KeyA',Value:true,Type:'CheckBox'}, {Key:'KeyB',Value:'[0,3,8]',Type:'MultiSelect'}, {Key:'KeyC',Value:'xyz',Type:'Input'}]  
        /// Or Empty in order to new build
        /// </summary>
        /// <param name="value"></param>

        public ExtentionData(string value)
        {
            this._value = value;
            if (string.IsNullOrWhiteSpace(value))
            {
                KeyValues = new List<KeyValues>();
            }
            else
            {
                KeyValues = KeyValuePairsData<KeyValues[]>.Deserialize(this._value).ToList();
            }
        }

        public ExtentionData(ExtentionData updatedExtentionData, string prevValue):this(prevValue)
        {
            if (updatedExtentionData != null)
            {
                foreach (var item in updatedExtentionData.KeyValues)
                {
                    UpdateOrAddKeyValues(item);
                }
            }
        }

        public ExtentionData(List<KeyValues> keyValues)
        {
            if (keyValues == null)
            {
                KeyValues = new List<KeyValues>();
            }
            else
            {
                KeyValues = keyValues;
            }
        }

        public ExtentionData() : this("") { }
        public override string ToString()
        {
            if (this != null)
                return this.Serialize();
            return string.Empty;
        }
        public KeyValues Find(string key)
        {
            return KeyValues.FirstOrDefault(x => x.Key == key);
        }
        public T Find<T>(string key) where T : class
        {
            var keyValuesPair = this.Find(key);
            if (keyValuesPair != null)
            {
                return keyValuesPair as T;
            }
            else
            {
                return null;
            }
        }
        public bool Delete(string key)
        {
            var keyVauesPair = this.Find(key);
            if (keyVauesPair == null)
                return false;
            else
            {
                return KeyValues.Remove(keyVauesPair);
            }
        }
        public bool UpdateOrAddKeyValues(KeyValues keyValues)
        {
            var keyVauesPair = Find(keyValues.Key);
            if (keyVauesPair != null)
            {
                keyVauesPair.Type = keyValues.Type;
                keyValues.Value = keyValues.Value;
            }
            else
            {
                KeyValues.Add(keyValues);
            }
            return true;
        }
        public string Serialize()
        {
            return KeyValuePairsData<KeyValues[]>.Serialize(KeyValues.ToArray());
        }
    }
}
