using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
 using System.Reflection ;

namespace TrueMed.RequisitionManagement.Business.Services.GenericLogics
{
  
    public static class ObjectExtensions
    {
        public static object GetPropertyValue(this object obj, string propertyName)
        {
            PropertyInfo propertyInfo = obj.GetType().GetProperty(propertyName);
            if (propertyInfo == null)
            {
                throw new ArgumentException($"Property '{propertyName}' not found on object of type '{obj.GetType().FullName}'.");
            }
            return propertyInfo.GetValue(obj, null);
        }
    }

}
