using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Helpers.ExtentionData
{
    public class KeyValuePair<TKey, TValue>
    {
        public TKey Key { get; set; }
        public TValue Value { get; set; }
    }
    public class KeyValues : KeyValuePair<string, object>
    {
        public FieldType Type { get; set; }
    }

    public enum FieldType
    {
        Checkbox,
        Radio,
        Select,
        MultiSelect,
        Plain,
        Object
    }


    public class KeyValuesMultiSelect : KeyValues
    {
        public new string[] Value { get; set; }
    }

    public class KeyValuesInput : KeyValues
    {
        public new string Value { get; set; }
    }

    public class KeyValuesCheckbox : KeyValues
    {
        public new bool Value { get; set; }
    }

    public class KeyValuesRadio : KeyValues
    {
        public new string Value { get; set; }
    }

    public class KeyValuesSelect : KeyValues
    {
        public new string Value { get; set; }
    }
}
