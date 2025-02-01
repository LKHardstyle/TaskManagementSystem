using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Server.Items;
using TaskManagementSystemFinal.Server.Items;
using TaskManagementSystemFinal.Server.Migrations;
using TaskManagementSystemFinal.Server.Models;
using TaskManagementSystemFinal.Server.Requests;


namespace TaskManagementSystem.Server.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthController(AppDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
        }

        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Username oder Password ist ungültig");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.UserName);
            if (user == null)
            {
                return Unauthorized("Benutzer nicht gefunden oder Password falsch");
            }

            var verficationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if(verficationResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Benutzer nicht gefunden oder Password falsch");
            }

            return Ok(new { message = "Login Erfolgreich", Id = user.Id });
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if(string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest("Ungültige Eingaben.");
            }
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username || u.Email == request.Email);

            if (existingUser != null)
            {
                return Conflict("Benutzername oder E-Mail wird bereits verwendet");
            }

            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            newUser.PasswordHash = _passwordHasher.HashPassword(newUser, request.Password);       

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Benutzer erfolgreich registriert", username = newUser.Username });
        }
        
    }
}