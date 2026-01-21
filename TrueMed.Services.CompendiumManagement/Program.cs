using Microsoft.OpenApi.Models;
using TrueMed.Business.GlobalConfigurtation;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Business.Services.Common.Implementation;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Business.Services.IdentityModel;
using TrueMed.CompendiumManagement.Business.Implementation;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Implementation;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Implementation;
using TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Interface;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Compendium Management", Version = "v1" });
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
    c.CustomSchemaIds(type => type.ToString());
});
builder.AddGlobalServices();
builder.Services.BuildServiceProvider().GetRequiredService<IConfiguration>();
builder.Services.AddCustomAuthentication();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
#region Services Injected
builder.Services.AddScoped<IUtilityService, UtilityService>();

builder.Services.AddScoped<IIDCompendiumAssayDataService, IDCompendiumAssayDataService>();
builder.Services.AddScoped<IRequisitionManagement, RequisitionManagement>();
builder.Services.AddScoped<IPanelManagement, PanelManagement>();
builder.Services.AddScoped<IPanelTypeManagement, PanelTypeManagement>();
builder.Services.AddScoped<IPanelGroupManagement, PanelGroupManagement>();
builder.Services.AddScoped<ITestTypeManagement, TestTypeManagement>();
builder.Services.AddScoped<ITestAssignmentManagement, TestAssignmentManagement>();
builder.Services.AddScoped<ITestManagement, TestManagement>();
builder.Services.AddScoped<ITestSetupService, TestSetupService>();
builder.Services.AddScoped<ISpecimenTypeService, SpecimenTypeService>();
builder.Services.AddScoped<ISpecimenTypeAssignmentService, SpecimenTypeAssignmentService>();
builder.Services.AddScoped<ITestTypeService, TestTypeService>();
builder.Services.AddScoped<ICompendiumDependencyReflexService, CompendiumDependencyReflexService>();
builder.Services.AddScoped<IBloodCompendiumGroupTestsType, BloodCompendiumGroupTestsType>();
builder.Services.AddScoped<IDapperManager, DapperManager>();
builder.Services.AddScoped<ICacheManager, CacheManager>();
builder.Services.AddScoped<IPanelSetupService, PanelSetupService>();
builder.Services.AddScoped<IIDCompendiumPanelMappingService, IDCompendiumPanelMappingService>();
builder.Services.AddScoped<IIDCompendiumReportingRulesService, IDCompendiumReportingRulesService>();
builder.Services.AddScoped<IIDCompendiumControlReportingRuleService, IDCompendiumControlReportingRuleService>();
builder.Services.AddScoped<ILookupManager, LookupManager>();
builder.Services.AddSingleton(new ConfigurationKeys(builder.Configuration));
#endregion


builder.Services.AddAuthorization();
var app = builder.Build();
app.AddGlobalConfiguration();
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "Compendium Management V1");
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
