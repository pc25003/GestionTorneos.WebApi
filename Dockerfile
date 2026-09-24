FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar proyectos
COPY ["src/GestionTorneos.WebApi/GestionTorneos.WebApi.csproj", "src/GestionTorneos.WebApi/"]
COPY ["src/GestionTorneos.Application/GestionTorneos.Application.csproj", "src/GestionTorneos.Application/"]
COPY ["src/GestionTorneos.Domain/GestionTorneos.Domain.csproj", "src/GestionTorneos.Domain/"]
COPY ["src/GestionTorneos.Infrastructure/GestionTorneos.Infrastructure.csproj", "src/GestionTorneos.Infrastructure/"]

# Restaurar dependencias
RUN dotnet restore "src/GestionTorneos.WebApi/GestionTorneos.WebApi.csproj"

# Copiar el código completo y compilar
COPY . .
WORKDIR "/src/src/GestionTorneos.WebApi"
RUN dotnet build "GestionTorneos.WebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GestionTorneos.WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GestionTorneos.WebApi.dll"]