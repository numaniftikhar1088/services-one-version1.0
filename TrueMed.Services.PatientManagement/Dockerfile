#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["TrueMed.Services.PatientManagement/TrueMed.Services.PatientManagement.csproj", "TrueMed.Services.PatientManagement/"]
COPY ["TrueMed.Business/TrueMed.Business.csproj", "TrueMed.Business/"]
COPY ["TrueMed.Domain/TrueMed.Domain.csproj", "TrueMed.Domain/"]
COPY ["TrueMed.UserManagement.Domain/TrueMed.UserManagement.Domain.csproj", "TrueMed.UserManagement.Domain/"]
COPY ["TrueMed.PatientManagement.Business/TrueMed.PatientManagement.Business.csproj", "TrueMed.PatientManagement.Business/"]
COPY ["TrueMed.PatientManagement.Domain/TrueMed.PatientManagement.Domain.csproj", "TrueMed.PatientManagement.Domain/"]
RUN dotnet restore "TrueMed.Services.PatientManagement/TrueMed.Services.PatientManagement.csproj"
COPY . .
WORKDIR "/src/TrueMed.Services.PatientManagement"
RUN dotnet build "TrueMed.Services.PatientManagement.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TrueMed.Services.PatientManagement.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TrueMed.Services.PatientManagement.dll"]