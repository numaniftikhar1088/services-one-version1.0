#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["TrueMed.Services.RequisitionManagement/TrueMed.Services.RequisitionManagement.csproj", "TrueMed.Services.RequisitionManagement/"]
RUN dotnet restore "TrueMed.Services.RequisitionManagement/TrueMed.Services.RequisitionManagement.csproj"
COPY . .
WORKDIR "/src/TrueMed.Services.RequisitionManagement"
RUN dotnet build "TrueMed.Services.RequisitionManagement.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TrueMed.Services.RequisitionManagement.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TrueMed.Services.RequisitionManagement.dll"]