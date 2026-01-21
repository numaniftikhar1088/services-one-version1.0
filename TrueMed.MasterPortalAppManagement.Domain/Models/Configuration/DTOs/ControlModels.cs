using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs
{
    public class ControlModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public FieldType Type { get; set; }
        public bool IsRequired { get; set; }
        public bool IsVisible { get; set; }
        public int Order { get; set; }
        public bool IsSystemDefined { get; set; }
        public ICollection<OptionModel>? Options
        {
            get
            {
                if (string.IsNullOrWhiteSpace(OptionsString))
                    return null;
                try
                {
                    return JsonConvert.DeserializeObject<ICollection<OptionModel>>(OptionsString);
                }
                catch
                {
                    return null;
                }
            }
        }
        public string OptionsString { get; set; } = string.Empty;
    }

    public enum FieldType
    {
        TextBox,
        TextArea,
        Email,
        Password,
        DropDown,
        RadioButton,
        ListBox,
        MultiSelect,
        CheckboxList,
        Document,
        Image,
        Icon,
        Checkbox,
        Switch,
        DateTime,
        Date,
        Time,
        Integer,
        Decimal,
        Signature
    }

    public class OptionModel
    {
        public string Value { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool? IsVisible { get; set; } = true;
    }
}
