#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["TrueMed.Services.MasterPortalAppManagement/TrueMed.Sevices.MasterPortalAppManagement.csproj", "TrueMed.Services.MasterPortalAppManagement/"]
RUN dotnet restore "TrueMed.Services.MasterPortalAppManagement/TrueMed.Sevices.MasterPortalAppManagement.csproj"
COPY . .
WORKDIR "/src/TrueMed.Services.MasterPortalAppManagement"
RUN dotnet build "TrueMed.Sevices.MasterPortalAppManagement.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TrueMed.Sevices.MasterPortalAppManagement.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TrueMed.Sevices.MasterPortalAppManagement.dll"]