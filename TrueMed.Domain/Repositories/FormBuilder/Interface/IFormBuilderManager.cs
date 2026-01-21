using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.FormBuilder;

namespace TrueMed.Domain.Repositories.FormBuilder.Interface
{
    public interface IFormBuilderManager : IEnconterConnection
    {
        FormBuild GetFormByKey(string formKey);
        ICollection<Form> GetForms(int pageNumber, int pageSize);
        bool IsExists(string formKey);
        bool SaveOrUpdateForm(FormBuild formBuild);
    }
}
