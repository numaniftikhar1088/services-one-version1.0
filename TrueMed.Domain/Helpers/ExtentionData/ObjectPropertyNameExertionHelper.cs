using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Helpers.ExtentionData
{
    public static class ObjectPropertyNameExtensionHelper
    {
        public static string GetPropertyValue(this object obj, string propertyName)
        {
            PropertyInfo propertyInfo = obj.GetType().GetProperty(propertyName, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);
            if (propertyInfo == null)
            {
                return "";
                //throw new ArgumentException($"Property '{propertyName}' not found on object of type '{obj.GetType().FullName}'.");
            }
            return (propertyInfo?.GetValue(obj) ?? "").ToString();
        }
    }
}
