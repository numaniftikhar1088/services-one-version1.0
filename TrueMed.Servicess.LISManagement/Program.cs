using FluentValidation.AspNetCore;
using Microsoft.OpenApi.Models;
using TrueMed.Business.GlobalConfigurtation;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Business.Services.IdentityModel;
using TrueMed.LISManagement.Busines.Implementations;
using TrueMed.LISManagement.Busines.Interfaces;
using TrueMed.LISManagement.Business.Implementations;
using TrueMed.LISManagement.Business.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "LIS Management", Version = "v1" });
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
});

System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
builder.AddGlobalServices();
builder.Services.AddCustomAuthentication();
builder.Services.AddAuthorization();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddFluentValidation(opt => opt.RegisterValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies()));

#region Services Injected Section
builder.Services.AddScoped<IResultFileService, ResultFileService>();
builder.Services.AddScoped<IIDResultDataService, IDResultDataService>();
builder.Services.AddScoped<IIDLISPreConfiguration, IDLISPreConfiguration>();
builder.Services.AddScoped<ILookupManager, LookupManager>();
builder.Services.AddScoped<IBlobStorageManager, BlobStorageManager>();
#endregion

var app = builder.Build();
app.AddGlobalConfiguration();
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "LIS Management V1");
});

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
app.Run();

