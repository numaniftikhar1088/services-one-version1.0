#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["TrueMed.Services.FacilityManagement/TrueMed.Services.FacilityManagement.csproj", "TrueMed.Services.FacilityManagement/"]
COPY ["TrueMed.Business/TrueMed.Business.csproj", "TrueMed.Business/"]
COPY ["TrueMed.Domain/TrueMed.Domain.csproj", "TrueMed.Domain/"]
COPY ["TrueMed.UserManagement.Domain/TrueMed.UserManagement.Domain.csproj", "TrueMed.UserManagement.Domain/"]
COPY ["TrueMed.FacilityManagement.Domain/TrueMed.FacilityManagement.Domain.csproj", "TrueMed.FacilityManagement.Domain/"]
RUN dotnet restore "TrueMed.Services.FacilityManagement/TrueMed.Services.FacilityManagement.csproj"
COPY . .
WORKDIR "/src/TrueMed.Services.FacilityManagement"
RUN dotnet build "TrueMed.Services.FacilityManagement.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TrueMed.Services.FacilityManagement.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TrueMed.Services.FacilityManagement.dll"]