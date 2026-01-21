using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Helpers
{
    public static class ReflectionHelper
    {

        public static ParameterInfo[]? GetConstructorParamters<T>(params Type[] types)
        {
            return typeof(T)?
                .GetConstructor(BindingFlags.Instance | BindingFlags.Public, null, types, null)?
                .GetParameters();
        }

        public static T? GetDefultValue<T>(this ICollection<ParameterInfo>? parameterInfos, string name )
        {
            return (T?)Convert.ChangeType(parameterInfos?.Where(x => x.Name.Equals(name,
                StringComparison.OrdinalIgnoreCase))
                .Select(x => x.DefaultValue)
                .FirstOrDefault(), typeof(T));
        }
    }
}
