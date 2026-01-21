#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["TrueMed.Servicess.LISManagement/TrueMed.Servicess.LISManagement.csproj", "TrueMed.Servicess.LISManagement/"]
COPY ["TrueMed.Business/TrueMed.Business.csproj", "TrueMed.Business/"]
COPY ["TrueMed.Domain/TrueMed.Domain.csproj", "TrueMed.Domain/"]
COPY ["TrueMed.UserManagement.Domain/TrueMed.UserManagement.Domain.csproj", "TrueMed.UserManagement.Domain/"]
COPY ["TrueMed.LISManagement.Busines/TrueMed.LISManagement.Busines.csproj", "TrueMed.LISManagement.Busines/"]
COPY ["TrueMed.LISManagement.Domains/TrueMed.LISManagement.Domains.csproj", "TrueMed.LISManagement.Domains/"]
RUN dotnet restore "TrueMed.Servicess.LISManagement/TrueMed.Servicess.LISManagement.csproj"
COPY . .
WORKDIR "/src/TrueMed.Servicess.LISManagement"
RUN dotnet build "TrueMed.Servicess.LISManagement.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TrueMed.Servicess.LISManagement.csproj" -c Release -o /app/publish /p:UseAppHost=true

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TrueMed.Servicess.LISManagement.dll"]