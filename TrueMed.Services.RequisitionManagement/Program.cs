using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TrueMed.Business.GlobalConfigurtation;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Business.Services.Common.Implementation;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Business.Services.IdentityModel;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Helpers.MailClient;
using TrueMed.Business.Interface;
using TrueMed.Domain.Repositories.Identity.Interface;
using TrueMed.Domain.Repositories.Lab.Interface;
using TrueMed.RequisitionManagement.Business.Services.Implementation;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Implementation;
using TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Interface;

var builder = WebApplication.CreateBuilder(args);

//Added Services Required
//builder.AddTheServicesRequireds();

// Add Shared Servies
builder.AddGlobalServices();

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddFluentValidation(opt => opt.RegisterValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies()));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Requisition Management", Version = "v1" });
});
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddCustomAuthentication();
builder.Services.AddAuthorization();
builder.Services.AddScoped<IRequisitionManagement, RequisitionManagement>();
builder.Services.AddScoped<IUtilityService, UtilityService>();
builder.Services.AddScoped<ISingleRequistionService, SingleRequistionService>();
builder.Services.AddScoped<IViewRequisitionService, ViewRequisitionService>();
builder.Services.AddScoped<TrueMed.Business.Interface.ICacheManager, TrueMed.Business.Implementation.CacheManager>();
builder.Services.AddScoped<ILookupManager, LookupManager>();
builder.Services.AddScoped<IRequisitionLoadService, RequisitionLoadService>();
builder.Services.AddScoped<IDrugAllergiesAssignmentService, DrugAllergiesAssignmentService>();
builder.Services.AddScoped<IPendingRequisitionService, PendingRequisitionService>();  
builder.Services.AddTransient<TrueMed.Business.Interface.IDapperManager, TrueMed.Business.Implementation.DapperManager>();
builder.Services.AddTransient<IBlobStorageManager, BlobStorageManager>();
builder.Services.AddScoped<IRequisitionService, RequisitionService>();
builder.Services.AddScoped<IPrinterSetupService, PrinterSetupService>();
builder.Services.AddScoped<ISignatureInformationService, SignatureInformationService>();
builder.Services.AddScoped<IBulkCheckInService, BulkCheckInService>();

var app = builder.Build();

app.AddGlobalConfiguration();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "Requisition Management V1");
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

