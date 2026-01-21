using FluentValidation.AspNetCore;
using Microsoft.OpenApi.Models;
using TrueMed.Business.GlobalConfigurtation;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Business.Services.Common.Implementation;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Business.Services.IdentityModel;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Implementation;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Implementations;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Interfaces;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// swagger

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Master Portal Management", Version = "v1" });
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
    c.CustomSchemaIds(type => type.ToString());
});

builder.AddGlobalServices();
builder.Services.AddCustomAuthentication();
builder.Services.AddFluentValidation(opt => opt.RegisterValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies()));
builder.Services.AddScoped<ILabManagement, LabManagement>();
builder.Services.AddScoped<ILabAssignmentManagement, LabAssignmentManagement>();
builder.Services.AddScoped<IPanelSetupService, PanelSetupService>();
builder.Services.AddScoped<ITestSetupService, TestSetupService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IRequisitionTypeService, RequisitionTypeService>();
builder.Services.AddScoped<IDrugAllergyService, DrugAllergyService>();
builder.Services.AddScoped<ILabManagementService_v2, LabManagementService_v2>();

builder.Services.AddScoped<IModuleManagement, ModuleManagement>();
//builder.Services.AddScoped(typeof(ISectionControlsManagement<>), typeof(SectionControlsManagement<>));
//builder.Services.AddScoped(typeof(IControlManagement<>), typeof(ControlManagement<>));
//builder.Services.AddScoped(typeof(ISectionManagement<>), typeof(SectionManagement<>));
//builder.Services.AddScoped(typeof(IModuleChildGrantManagement<>), typeof(ModuleChildGrantManagement<>));
builder.Services.AddScoped<IUtilityService, UtilityService>();
builder.Services.AddScoped<TrueMed.MasterPortalAppManagement.Domain.Repositories.Menu.Interface.IMenuManagement, TrueMed.MasterPortalAppManagement.Domain.Repositories.Menu.Implementation.MenuManagement>();
builder.Services.AddScoped<ILabConfigurationService, LabConfigurationService>();
builder.Services.AddSingleton<ICacheManager, CacheManager>();

builder.Services.AddScoped< TrueMed.MasterPortalServices.BusinessLayer.Services.Interface.IMenuManagement,TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation.MenuManagement> ();
builder.Services.AddScoped<TrueMed.Business.Interface.ICacheManager, TrueMed.Business.Implementation.CacheManager>();
builder.Services.AddScoped<ILookupManager, LookupManager>();
builder.Services.AddScoped<ILabTestPanelAssignmentService,LabTestPanelAssignmentService>();
builder.Services.AddTransient<IBlobStorageManager, BlobStorageManager>();
builder.Services.AddTransient<ILab_ReferenceLabService, Lab_ReferenceLabService>();
builder.Services.AddScoped<ITenantManger, TenantManger>();

//builder.AddAndMigrateTenantDatabases();
builder.Services.AddAuthorization();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();
app.AddGlobalConfiguration();
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "Master Portal Management V1");
});



app.MapGet("/", () => "Hello World!");


app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
app.Run();
