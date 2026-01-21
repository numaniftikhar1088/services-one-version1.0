using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.FormBuilder;
using TrueMed.Domain.Repositories.Connection.Interface;
using TrueMed.Domain.Repositories.FormBuilder.Interface;

namespace TrueMed.Domain.Repositories.FormBuilder.Implementation
{
    //public class FormBuilderManager :EnconterConnection, IFormBuilderManager
    //{
    //    public FormBuilderManager(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
    //    {
    //    }

    //    public FormBuilderManager(IConnectionManager connectionManager) : base(connectionManager)
    //    {
    //    }

    //    public FormBuilderManager(IConnectionManager connectionManager, ApplicationDBContext dbContext) : base(connectionManager, dbContext)
    //    {
    //    }

    //    public ICollection<Form> GetForms(int pageNumber, int pageSize)
    //    {
    //        return DbContext.tblDynamicForms.OrderBy(x => x.CreateDate).Skip((pageNumber - 1) * pageSize).Take(pageSize).Select(x => new Form { Key = x.Key, Description = x.Description, CreateDate = x.CreateDate }).ToList();
    //    }

    //    public FormBuild GetFormByKey(string formKey)
    //    {
    //        return DbContext.tblDynamicForms.Select(x => new FormBuild { Key = x.Key, Description = x.Description, CreateDate = x.CreateDate, Form = x.Form, RawForm = x.RawForm }).FirstOrDefault(x => x.Key == formKey);
    //    }

    //    public bool IsExists(string formKey)
    //    {
    //        return DbContext.tblDynamicForms.Any(x => x.Key == formKey);
    //    }

    //    public bool SaveOrUpdateForm(FormBuild formBuild)
    //    {
    //        var form = DbContext.tblDynamicForms.FirstOrDefault(x => x.Key == formBuild.Key);
    //        if (form == null)
    //        {
    //            form = new tblDynamicForm();
    //            form.Key = formBuild.Key;
    //            DbContext.tblDynamicForms.Add(form);
    //        }

    //        form.Description = formBuild.Description;
    //        form.CreateDate = formBuild.CreateDate;
    //        form.Form = formBuild.Form;
    //        form.RawForm = formBuild.RawForm;

    //        return DbContext.SaveChanges() > 0;
    //    }

    //    public override void InitializeComponents(IConnectionManager connectionManager, ApplicationDBContext dbContext)
    //    {
            
    //    }
    //}
}
