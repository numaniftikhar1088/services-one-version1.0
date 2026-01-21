using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.ReportingServer.Business.Services.Implementations;
using TrueMed.ReportingServer.Business.Services.Interfaces;
using TrueMed.Business.Services.IdentityModel;
using TrueMed.Business.GlobalConfigurtation;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();
builder.AddGlobalServices();

builder.Services.AddCustomAuthentication();
builder.Services.AddAuthorization();
#region Services Injection Container
builder.Services.AddScoped<IIDLISReportService, IDLISReportService>();
builder.Services.AddScoped<IBatchQCReportService, BatchQCReportService>();
builder.Services.AddScoped<ILookupManager, LookupManager>();
builder.Services.AddScoped<IReqOrderViewService, ReqOrderViewService>();
#endregion
var app = builder.Build();
app.AddGlobalConfiguration();
QuestPDF.Settings.License=QuestPDF.Infrastructure.LicenseType.Community;

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
