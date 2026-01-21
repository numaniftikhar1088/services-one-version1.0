using Microsoft.Graph.ExternalConnectors;
using Microsoft.OpenApi.Models;
using MMLib.SwaggerForOcelot.DependencyInjection;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Ocelot.Provider.Polly;
using Ocelot.Values;
using TrueMed.ApiGateway;
using TrueMed.ApiGateway.Helpers;
using TrueMed.Domain.Helpers;
using TrueMed.Business.Interface;
using TrueMed_Project_One_Service.Helpers;

var builder = WebApplication.CreateBuilder(args);

var environment = builder.Environment.EnvironmentName;


builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json",true,true)
        .AddJsonFile($"ocelot.{environment.ToLower()}.json", optional: false, reloadOnChange: true)
        .AddEnvironmentVariables();

builder.Services.AddOcelot(builder.Configuration).AddDelegatingHandler<DeletegatingHttpRequest>(true).AddPolly();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSingleton<IConfiguration>(builder.Configuration);
//var routes = "Routes";
//builder.Services.AddSwaggerForOcelot(builder.Configuration);

//builder.Configuration.AddOcelotWithSwaggerSupport(options =>
//{
//    options.Folder = routes;
//});


//builder.Services.AddOcelot(builder.Configuration).AddPolly();

var startup = new Startup(builder.Configuration);

startup.ConfigureServices(builder.Services);


//builder.Services.AddSwaggerForOcelot(builder.Configuration);
builder.Services.AddSwaggerForOcelot(builder.Configuration,
  (o) =>
  {
      o.GenerateDocsForGatewayItSelf = true;
     
      o.GenerateDocsDocsForGatewayItSelf(opt =>
      {
          opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
          {
              Description = @"JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below. Example: 'Bearer 12345abcdef'",
              Name = "Authorization",
              In = ParameterLocation.Header,
              Type = SecuritySchemeType.ApiKey,
              Scheme = "Bearer"
          });
          opt.AddSecurityRequirement(new OpenApiSecurityRequirement()
          {
              {
                  new OpenApiSecurityScheme
                  {
                      Reference = new OpenApiReference
                      {
                          Type = ReferenceType.SecurityScheme,
                          Id = "Bearer"
                      },
                      Scheme = "oauth2",
                      Name = "Bearer",
                      In = ParameterLocation.Header,
                  },
                  new List<string>()
              }
          });
      });
  });










//builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle


// Swagger for ocelot
//builder.Services.AddSwaggerGen();





var app = builder.Build();

//app.UseSwagger();

//app.UseSwaggerForOcelotUI(options =>
//{
//    options.PathToSwaggerGenerator = "/swagger/docs";
//    options.ReConfigureUpstreamSwaggerJson = AlterUpstream.AlterUpstreamSwaggerJson;

//}).UseOcelot().Wait();

app.UseSwaggerForOcelotUI(opt => {
    opt.ReConfigureUpstreamSwaggerJson = AlterUpstream.AlterUpstreamSwaggerJson;
    opt.DownstreamSwaggerHeaders = new[]
 {
         new KeyValuePair<string, string>("X-Portal-Key", "Lab Key"),
         new KeyValuePair<string, string>("Authorization", "Bearer Token"),
     };
}, uiOpt =>
{
    uiOpt.DocumentTitle = "TrueMed APIs";
    // uiOpt.DownstreamSwaggerHeaders= new IEnumerable<KeyValuePair<string, string>>("")
    uiOpt.EnablePersistAuthorization();
 //   uiOpt.DownstreamSwaggerHeaders = new[]
 //{
 //     new KeyValuePair<string, string>("X-Portal-Key", "Lab Key"),
 //     new KeyValuePair<string, string>("Authorization", "Bearer Token"),
 // };


});


app.UseDeveloperExceptionPage();
startup.Configure(app, builder.Environment);
await app.UseOcelot();
app.Run();
