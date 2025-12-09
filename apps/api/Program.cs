using InkSaver.Api.Controllers; // Ensure this matches your namespace

var builder = WebApplication.CreateBuilder(args);


// Add support for Controllers
builder.Services.AddControllers();

// Add Swagger/OpenAPI (Useful for testing)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 

// Add CORS to allow Next.js (port 3000) to talk to .NET (port 5000)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowNextJs");

app.UseAuthorization();

// Map the Controllers
app.MapControllers(); 

app.Run();