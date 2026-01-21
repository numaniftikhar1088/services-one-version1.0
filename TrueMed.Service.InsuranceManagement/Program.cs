using Microsoft.OpenApi.Models;
using System.Net.Mail;
using TrueMed.Business.GlobalConfigurtation;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Business.Services.Common.Implementation;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Business.Services.IdentityModel;
using TrueMed.InsuranceManagement.Business.Implementations;
using TrueMed.InsuranceManagement.Business.Interface;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Insurance Management", Version = "v1" });
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
});

builder.AddGlobalServices();
builder.Services.AddCustomAuthentication();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

#region Services Injected
builder.Services.AddScoped<IInsuranceAssignmentService, InsuranceAssignmentService>();
builder.Services.AddScoped<IInsuranceSetupService, InsuranceSetupService>();
builder.Services.AddScoped<IInsuranceProviderService, InsuranceProviderService>();
builder.Services.AddScoped<IOrderInsuranceService, OrderInsuranceService>();
builder.Services.AddScoped<IICD10CodeSetupService, ICD10CodeSetupService>();
builder.Services.AddScoped<IICD10CodeAssignmentService, ICD10CodeAssignmentService>();
builder.Services.AddScoped<IUtilityService, UtilityService>();

builder.Services.AddScoped<TrueMed.Business.Interface.ICacheManager, TrueMed.Business.Implementation.CacheManager>();
builder.Services.AddScoped<ILookupManager, LookupManager>();
builder.Services.AddScoped<IEmailManager, EmailManager>();



builder.Services.AddScoped<SmtpClient>();
#endregion

builder.Services.AddAuthorization();
var app = builder.Build();
app.AddGlobalConfiguration();
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "Insurance Management V1");
});

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
app.Run();
