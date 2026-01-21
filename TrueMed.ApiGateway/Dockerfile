#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["TrueMed.ApiGateway/TrueMed.ApiGateway.csproj", "TrueMed.ApiGateway/"]
COPY ["TrueMed.Business/TrueMed.Business.csproj", "TrueMed.Business/"]
COPY ["TrueMed.Domain/TrueMed.Domain.csproj", "TrueMed.Domain/"]
#COPY ["TrueMed.Domain.Model/TrueMed.Domain.Model.csproj", "TrueMed.Domain.Model/"]
COPY ["TrueMed.UserManagement.Business/TrueMed.UserManagement.Business.csproj", "TrueMed.UserManagement.Business/"]
#COPY ["TrueMed.UserManagement.Domain.Models/TrueMed.UserManagement.Domain.Models.csproj", "TrueMed.UserManagement.Domain.Models/"]
COPY ["TrueMed.UserManagement.Domain/TrueMed.UserManagement.Domain.csproj", "TrueMed.UserManagement.Domain/"]
RUN dotnet restore "TrueMed.ApiGateway/TrueMed.ApiGateway.csproj"
COPY . .
WORKDIR "/src/TrueMed.ApiGateway"
RUN dotnet build "TrueMed.ApiGateway.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TrueMed.ApiGateway.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TrueMed.ApiGateway.dll"]

 