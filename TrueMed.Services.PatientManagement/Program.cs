using FluentValidation.AspNetCore;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using TrueMed.Business.GlobalConfigurtation;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Business.Middlewares;
using TrueMed.Business.Services.Common.Implementation;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Business.Services.IdentityModel;
using TrueMed.PatientManagement.Business.Services.Implementations;
using TrueMed.PatientManagement.Business.Services.Interfaces;
using TrueMed.PatientManagement.Domain.Repositories.Patient.Implementation;
using TrueMed.PatientManagement.Domain.Repositories.Patient.Interface;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.BuildServiceProvider().GetRequiredService<IConfiguration>();
builder.Services.AddFluentValidation(opt => opt.RegisterValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies()));
// Add services to the container.
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Patient Management", Version = "v1" });
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
    c.CustomSchemaIds(type => type.ToString());
});

//builder.AddTheServicesRequireds();
builder.AddGlobalServices();
builder.Services.AddCustomAuthentication();


builder.Services.AddAuthorization();


builder.Services.AddScoped<IPatientManagement, PatientManagement>();
builder.Services.AddScoped<IPatientLoginManagement, PatientLoginManagement>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IPatientInsuranceService, PatientInsuranceService>();
builder.Services.AddScoped<IUtilityService, UtilityService>();
builder.Services.AddScoped<ILookupManager, LookupManager>();
builder.Services.AddScoped<ICacheManager, CacheManager>();

builder.Services.AddTransient<IPatientService, PatientService>();
var app = builder.Build();


app.AddGlobalConfiguration();
// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "Patient Management V1");
});

//app.UseMiddleware<RedirectMiddleware>();
app.MapGet("/", () => "Hello World!");

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
app.Run();
