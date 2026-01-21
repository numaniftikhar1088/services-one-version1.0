using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Model.Identity
{
    public partial class IdentityResult
    {
        public IdentityResult(Status status, IdentityResult identityResult) : this(identityResult.Status, identityResult.Message)
        {
            Errors = identityResult.Errors;
            Type = identityResult.Type;
            Key = identityResult.Key;
            Id = identityResult.Id;
        }

        public IdentityResult(IdentityResult identityResult, string? key = "") : this(identityResult.Status, identityResult.Message)
        {
            Errors = identityResult.Errors;
            Type = identityResult.Type;
            if (!string.IsNullOrEmpty(key))
                Key = key;
        }
        public IdentityResult(Status status, string msg) : this(status, msg, null, "identity") { }
        public IdentityResult(Status status, string msg, string? errorKey = null, string type = "identity")
        {
            Status = status;
            Message = msg;
            Type = type;
            Errors = new Dictionary<string, List<string>>();
            if (!string.IsNullOrWhiteSpace(errorKey))
            {
                AddError(errorKey, msg);
            }
        }
        public void UpdateErrors(IDictionary<string, List<string>> errors)
        {
            foreach (var item in errors)
            {
                foreach (var messge in item.Value)
                {
                    AddError(item.Key, messge);
                }
            }
        }

        public void AddError(string errorKey, string message)
        {
            var listErrors = new List<string>();
            if (Errors.TryGetValue(errorKey, out var values)
                && Errors.Remove(errorKey))
            {
                listErrors.AddRange(values);
            }

            listErrors.Add(message);
            Errors.Add(string.IsNullOrWhiteSpace(Key) ? errorKey : Key + "-" + errorKey, listErrors);
        }
        public void AddError(string errorKey, Validator validator)
        {
            switch (validator)
            {
                case Validator.Required:
                    AddError(errorKey, $"{errorKey} is required field.");
                    break;
                case Validator.AlreadyFound:
                    AddError(errorKey, $"{errorKey}'s value is already exists.");
                    break;
                case Validator.NotFound:
                    AddError(errorKey, $"{errorKey}'s value not exists.");
                    break;
                case Validator.InvalidValue:
                    AddError(errorKey, $"{errorKey}'s value is invalid.");
                    break;
            }
        }
        public void AddError(string errorKey, List<string> messages)
        {
            var listErrors = new List<string>();
            if (Errors.TryGetValue(errorKey, out var values) && Errors.Remove(errorKey))
            {
                listErrors.AddRange(values);
            }

            listErrors.AddRange(messages);
            Errors.Add(string.IsNullOrWhiteSpace(Key) ? errorKey : Key + "-" + errorKey, listErrors);
        }
        public bool HasErrors
        {
            get
            {
                return Errors.Count > 0;
            }
        }

        public bool HasErrorKey(string name)
        {
            return Errors.ContainsKey(name);
        }

        public bool UpdateErrorKey(string oldName, string newName)
        {
            var error = Errors.FirstOrDefault(x => x.Key.Equals(oldName, StringComparison.OrdinalIgnoreCase));
            if (HasErrorKey(oldName) && Errors.Remove(error))
            {
                Errors.Add(newName, error.Value);
                return true;
            }
            return false;
        }

        public Status Status { get; private set; }
        public string Message { get; private set; }
        public IDictionary<string, List<string>> Errors;
        public string toSerializeErrors()
        {
            if (Errors != null)
            {
                return JsonConvert.SerializeObject(Errors);
            }
            return string.Empty;
        }
        public bool IsSuccess
        {
            get
            {
                return Status == Status.Success;
            }
        }
        public string Type { get; set; }
        public string? Key { get; }

        public object? Id { get; private set; }
        public void UpdateIdentifier(object id)
        {
            Id = id;
        }

        public class Validators
        {
            public static bool IsValidEmail(string email)
            {
                var trimmedEmail = email.Trim();

                if (trimmedEmail.EndsWith("."))
                {
                    return false; // suggested by @TK-421
                }
                try
                {
                    var addr = new System.Net.Mail.MailAddress(email);
                    return addr.Address == trimmedEmail;
                }
                catch
                {
                    return false;
                }
            }
        }
    }


    public enum Validator
    {
        Required,
        AlreadyFound,
        NotFound,
        InvalidValue
    }


}
