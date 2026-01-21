using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Graph;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Asn1.X509.Qualified;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Business.Implementation
{
    public class SetValueInObject
    {
        public static void SaveValue<T>(ref T entity, string propertyName, dynamic dynamicvalue)
        {
          
          

            try
            {
                var value = dynamicvalue.ToString();
                if (string.IsNullOrEmpty(value))
                    return;
                if (entity == null)
                    throw new Exception("Entity must be initialized");

                var property = entity.GetType().GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                if (property == null)
                    return;


                if (property.PropertyType == typeof(Nullable<Int32>))
                    property.SetValue(entity, Convert.ToInt32(value),null);
                else if (property.PropertyType == typeof(Int32))
                     property.SetValue(entity,  Convert.ToInt32(value), null);
                else if (property.PropertyType == typeof(string))
                    property.SetValue(entity, value, null);
                else if (property.PropertyType == typeof(Nullable<bool>))
                    property.SetValue(entity, Convert.ToBoolean(value), null);
                else if (property.PropertyType == typeof(bool))
                    property.SetValue(entity,  Convert.ToBoolean(value), null);
                else if (property.PropertyType == typeof(Nullable<DateTime>))
                    property.SetValue(entity, Convert.ToDateTime(value), null);
                else if (property.PropertyType == typeof(DateTime))
                    property.SetValue(entity, Convert.ToDateTime(value), null);
                else if (property.PropertyType == typeof(Nullable<TimeSpan>))
                    property.SetValue(entity, TimeSpan.Parse(value), null);

                //                    switch (propertyType)
                //{
                //    case typeof(int):
                //        property.SetValue(entity, Convert.ToInt32(value), null);
                //        break;
                //        case typeof(int?):
                //        property.SetValue(entity, Convert.ToInt64(value), null);
                //        break;
                //    //case "System.String":
                //    //    property.SetValue(entity, value, null);
                //    //    break;
                //    //case "System.DateTime":
                //    //    property.SetValue(entity, Convert.ToDateTime(value), null);
                //    //    break;
                //    //case "System.Boolen":
                //    //    property.SetValue(entity, Convert.ToBoolean(value), null);
                //    //    break;
                //    default:
                //        property.SetValue(entity, value, null);
                //        break;
                //}





            }
            catch (Exception ex)
            {
                Console.WriteLine($"PropertryName:{propertyName} {Environment.NewLine}{ex.Message}");


            }
        }

        public static void UpdateObjectProperties<T>(T olderObject,ref T newerObject)
        {

            //var columnToEscape = new List<string>() {
            //"CreatedBy".ToLower(),
            //"CreatedDate".ToLower(),
            //"UpdatedBy".ToLower(),
            //"UpdatedDate".ToLower()
            ////"CreatedBy".ToLower(),
            ////"CreatedBy".ToLower(),
            //};

            Type type = typeof(T);
            PropertyInfo[] properties = type.GetProperties();

            foreach (PropertyInfo property in properties)
            {
                //columnToEscape.Any(x => x.Equals((property.Name ?? "").ToLower().Trim()))||
                if (property.Name.ToLower().Trim().StartsWith("tbl"))
                    continue;
                    


                object oldValue = property.GetValue(olderObject);
                object newValue = property.GetValue(newerObject);
                
                if ( (newValue != null&& oldValue!=null&&oldValue.Equals(newValue))
                    ||(newValue == null && oldValue == null))
                    continue;
                else if (newValue == null)
                {
                    property.SetValue(newerObject, oldValue);
                }
                else if (oldValue != newValue)
                {
                    property.SetValue(newerObject, newValue);
                }
            }
        }
    }
}
