#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["TrueMed.Service.InsuranceManagement/TrueMed.Service.InsuranceManagement.csproj", "TrueMed.Service.InsuranceManagement/"]
COPY ["TrueMed.Domain/TrueMed.Domain.csproj", "TrueMed.Domain/"]
COPY ["TrueMed.InsuranceManagement.Business/TrueMed.InsuranceManagement.Business.csproj", "TrueMed.InsuranceManagement.Business/"]
COPY ["TrueMed.Business/TrueMed.Business.csproj", "TrueMed.Business/"]
COPY ["TrueMed.UserManagement.Domain/TrueMed.UserManagement.Domain.csproj", "TrueMed.UserManagement.Domain/"]
COPY ["TrueMed.InsuranceManagement.Domains/TrueMed.InsuranceManagement.Domains.csproj", "TrueMed.InsuranceManagement.Domains/"]
COPY ["TrueMed.Validator/TrueMed.Validator.csproj", "TrueMed.Validator/"]
COPY ["TrueMed.CompendiumManagement.Domain/TrueMed.CompendiumManagement.Domain.csproj", "TrueMed.CompendiumManagement.Domain/"]
COPY ["TrueMed.FacilityManagement.Domain/TrueMed.FacilityManagement.Domain.csproj", "TrueMed.FacilityManagement.Domain/"]
COPY ["TrueMed.MasterPortalAppManagement.Domain/TrueMed.MasterPortalAppManagement.Domain.csproj", "TrueMed.MasterPortalAppManagement.Domain/"]
COPY ["TrueMed.PatientManagement.Domain/TrueMed.PatientManagement.Domain.csproj", "TrueMed.PatientManagement.Domain/"]
RUN dotnet restore "TrueMed.Service.InsuranceManagement/TrueMed.Service.InsuranceManagement.csproj"
COPY . .
WORKDIR "/src/TrueMed.Service.InsuranceManagement"
RUN dotnet build "TrueMed.Service.InsuranceManagement.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TrueMed.Service.InsuranceManagement.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TrueMed.Service.InsuranceManagement.dll"]