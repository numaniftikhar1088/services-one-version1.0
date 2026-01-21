using FluentValidation.AspNetCore;
using Microsoft.OpenApi.Models;
using System.Net.Mail;
using TrueMed.Business.GlobalConfigurtation;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Business.Services.File;
using TrueMed.Business.Services.IdentityModel;
using TrueMed.Domain.Repositories.Lab.Implementation;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Implementation;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Menu.Implementation;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Menu.Interface;
using TrueMed.UserManagement.Business.Services.Implementations;
using TrueMed.UserManagement.Business.Services.Interfaces;
using TrueMed.UserManagement.Domain.Repositories.File.Implementation;
using TrueMed.UserManagement.Domain.Repositories.File.Interface;

var builder = WebApplication.CreateBuilder(args);


//builder.Host.ConfigureAppConfiguration(x => x.SetBasePath(AppDomain.CurrentDomain.BaseDirectory).AddJsonFile(
//    Path.Combine("AppSettings", "globalconfig.json"), true).Build());

builder.Services.AddControllers();
builder.Services.AddFluentValidation(opt => opt.RegisterValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies()));
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "User Management", Version = "v1" });
});
//builder.AddTheServicesRequireds();
builder.Services.AddCustomAuthentication();
builder.Services.AddScoped<TrueMed.MasterPortalAppManagement.Domain.Repositories
    .Configuration.Interface.ILabMenuManagement, TrueMed.MasterPortalAppManagement.Domain
    .Repositories.Configuration.Implementation.LabMenuManagement>();

builder.Services.AddScoped<TrueMed.UserManagement.Domain
    .Repositories.Identity.Interface.ILabMenuManagement,
    TrueMed.UserManagement.Domain.Repositories
    .Identity.Implementation.LabMenuManagement>();
builder.Services.AddScoped<IMenuManagement, MenuManagement>();
builder.Services.AddScoped<IFileManagement, FileManagement>();
builder.Services.AddScoped<FacilityUserManagement, FacilityUserManagement>();
builder.Services.AddScoped<IFileTemplateManagement, FileTemplateManagement>();
builder.Services.AddScoped<ILabModuleManagement, LabModuleManagement>();
//builder.Services.AddScoped<ISecurityManager, SecurityManager>();
builder.Services.AddScoped<TrueMed.UserManagement.Business.Services.Interfaces.IUserManagement, TrueMed.UserManagement.Business.Services.Implementations.UserManagement>();
builder.Services.AddScoped<ILab_MenuManagement, Lab_MenuManagement>();
builder.Services.AddScoped<TrueMed.Business.Interface.ICacheManager, TrueMed.Business.Implementation.CacheManager>();
builder.Services.AddScoped<ILookupManager, LookupManager>();
builder.Services.AddTransient<SmtpClient>();
builder.Services.AddScoped<IEmailManager, EmailManager>();



builder.Services.AddScoped<IAccountManagement_V2, AccountManagement_V2>();
builder.Services.AddScoped<ILab_UserRolesAndRightsManagement, Lab_UserRolesAndRightsManagement>();
builder.Services.AddAuthorization();
// adding  shared services
builder.AddGlobalServices();

var app = builder.Build();
app.AddGlobalConfiguration();
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "User Management V1");
});
app.MapGet("/", () => "Hello World!");


app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

//app.UseRequestValidateMiddleware();



app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
