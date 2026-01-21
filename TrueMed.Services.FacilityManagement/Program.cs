using FluentValidation.AspNetCore;
using Microsoft.OpenApi.Models;
using System.Net.Mail;
using TrueMed.Business.GlobalConfigurtation;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Business.Services.Common.Implementation;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Business.Services.File;
using TrueMed.Business.Services.IdentityModel;
using TrueMed.Domain.Repositories.Lab.Implementation;
using TrueMed.Domain.Repositories.Lab.Interface;
using TrueMed.FacilityManagement.Business.Services.Implementation;
using TrueMed.FacilityManagement.Business.Services.Interface;
using TrueMed.FacilityManagement.Domain.Repositories.Facility.Implementation;
using TrueMed.FacilityManagement.Domain.Repositories.Facility.Interface;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Facility Management", Version = "v1" });
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
});
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddFluentValidation(opt => opt.RegisterValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies()));
//builder.AddTheServicesRequireds();
builder.AddGlobalServices();
builder.Services.AddCustomAuthentication();

#region Services Injected
builder.Services.AddScoped<IUtilityService, UtilityService>();
builder.Services.AddScoped<IFacilityUserManagement, FacilityUserManagement>();
builder.Services.AddScoped<ILabAssignmentService, LabAssignmentService>();
builder.Services.AddScoped<IFacilityManagement, FacilityManagement>();
builder.Services.AddScoped<IFileManagement, FileManagement>();
builder.Services.AddScoped<IFacilityLabManagement, FacilityLabManagement>();
builder.Services.AddScoped<IFacilityOptionsService, FacilityOptionsService>();
builder.Services.AddScoped<ILabFacInsTypeAssignmentService, LabFacInsTypeAssignmentService>();
builder.Services.AddScoped<IAssignRefLabAndGroupService, AssignRefLabAndGroupService>();
builder.Services.AddTransient<IBlobStorageManager,BlobStorageManager>();
builder.Services.AddTransient<ILookupManager,LookupManager>();
builder.Services.AddTransient<ICacheManager,CacheManager>();

builder.Services.AddOptions();


#endregion


builder.Services.AddAuthorization();

var app = builder.Build();
app.AddGlobalConfiguration();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "Facility Management V1");
});

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
app.Run();
