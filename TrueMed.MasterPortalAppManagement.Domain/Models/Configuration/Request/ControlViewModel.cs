using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request
{
    public class ControlViewModel : IValidatableObject
    {
        public int? Id { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Label { get; set; }
        public string? DefaultValue { get; set; }
        [Required]
        public int? Order { get; set; }
        [Required]
        public FieldType? Type { get; set; }
        [Required]
        public bool? IsRequired { get; set; }
        public bool? IsVisible { get; set; }
        public ICollection<OptionModel>? Options { get; set; }
        public string GetOptionsSearialized()
        {
            if (Options != null)
                return JsonConvert.SerializeObject(Options);
            return string.Empty;
        }
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if ((this.Type == FieldType.MultiSelect ||
                this.Type == FieldType.ListBox ||
                this.Type == FieldType.CheckboxList ||
                this.Type == FieldType.DropDown
                ) && (Options == null || Options.Count <= 0))
            {
                yield return new ValidationResult(
                $"Options must have some values, if and only if \"Field Type\" is " +
                $"MultiSelect, ListBox, Checkbox List or DropDown.",
                new[] { nameof(Options) });
            }
        }
    }

    public class UpdateControlViewModelMetadataType
    {
        [Required]
        public int? Id { get; set; }
    }

    [ModelMetadataType(typeof(UpdateControlViewModelMetadataType))]
    public class UpdateControlViewModel : ControlViewModel
    {

    }
}
