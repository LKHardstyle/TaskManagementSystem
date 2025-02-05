using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Server;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR(); // SignalR muss explizit registriert werden!

builder.Services.AddCors(options =>
{
options.AddPolicy("AllowSpecificOrigin",
    builder => builder.WithOrigins("https://localhost:51970")
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials());
});

// **Konfiguration aus `appsettings.json` laden**
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();

// **Hier sind die Endpunkte richtig platziert!**
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ChatHub>("/chatHub"); // SignalR-Endpoint registrieren
});

app.MapFallbackToFile("/index.html");

app.Run();