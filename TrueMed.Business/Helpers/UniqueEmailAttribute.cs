using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.Business.Helpers
{
    public class UniqueEmailAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var userManager = validationContext.GetService<IUserManagement>();
            if (value != null && !string.IsNullOrWhiteSpace(value.ToString()))
            {
                if (validationContext.ObjectType == typeof(UpdateMasterUserViewModel)
                    || validationContext.ObjectType == typeof(UpdateLabUserViewModel))
                {
                    dynamic objValues = validationContext.ObjectInstance;

                    var userId = userManager.GetUserIdByEmail(objValues.Email);
                    //check user if using already used user's email address,
                    if (!string.IsNullOrWhiteSpace(userId) && userId != objValues.Id)
                        return new ValidationResult($"Email \"{value}\" is already in use.");

                    return ValidationResult.Success;
                }
                else
                {
                    var isValid = userManager.IsUserEmailValid(
                        new KeyValuePairViewModel<string?>
                        {
                            KeyValue = value.ToString()
                        });
                    if (isValid)
                        return ValidationResult.Success;
                }
            }
            return new ValidationResult($"Email \"{value}\" is already taken.");
        }
    }
}
