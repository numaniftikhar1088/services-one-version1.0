namespace TrueMed.Domain.Extensions
{
    public static class MappingExtension
    {
        public static T ToObject<T>(this IDictionary<string, object> source)
            where T : class, new()
        {
            var genericObject = new T();
            var genericObjectType = genericObject.GetType();

            foreach (var item in source)
            {
                var key = char.ToUpper(item.Key[0]) + item.Key.Substring(1);
                var targetProperty = genericObjectType.GetProperty(key);

                if (targetProperty.GetMethod.ReturnType.FullName.ToLower().Contains("Int32".ToLower()))
                    targetProperty.SetValue(genericObject, Convert.ToInt32(item.Value.ToString()));

                else if (targetProperty.GetMethod.ReturnType.FullName.ToLower().Contains("String".ToLower()))
                    targetProperty.SetValue(genericObject, item.Value.ToString());

                else if (targetProperty.GetMethod.ReturnType.FullName.ToLower().Contains("DateTime".ToLower()))
                    targetProperty.SetValue(genericObject, Convert.ToDateTime(item.Value.ToString()));

                else if (targetProperty.GetMethod.ReturnType.FullName.ToLower().Contains("TimeSpan".ToLower()))
                    targetProperty.SetValue(genericObject, Convert.ToDateTime(item.Value.ToString()).TimeOfDay);

                else if (targetProperty.GetMethod.ReturnType.FullName.ToLower().Contains("Boolean".ToLower()))
                    targetProperty.SetValue(genericObject, Convert.ToBoolean(item.Value.ToString()));
            }
            return genericObject;
        }
    }
}
