using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Server;
using TaskManagementSystem.Server.Items;
using TaskManagementSystemFinal.Server.Requests;

namespace TaskManagementSystemFinal.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        private readonly PasswordHasher<User> _passwordHasher;
        public UsersController(AppDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<UsersToShow>>> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new UsersToShow
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("id")]
        public async Task<ActionResult<IEnumerable<User>>> GetUser(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new User
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    PasswordHash = u.PasswordHash,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if(user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserToEdit request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Benutzer nicht gefunden.");
            }

            // Benutzername & E-Mail aktualisieren
            user.Username = request.Username;
            user.Email = request.Email;
            user.UpdatedAt = DateTime.UtcNow;

            // Falls ein neues Passwort eingegeben wurde, hashen & speichern
            if (!string.IsNullOrWhiteSpace(request.NewPassword))
            {                
                user.PasswordHash = _passwordHasher.HashPassword(user, request.NewPassword);
            }

            await _context.SaveChangesAsync();
            return Ok("Profil aktualisiert.");
        }

        

        [HttpPut("reset-password/{id}")]
        public async Task<IActionResult> ResetPassword(int id, [FromBody] PasswordResetRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Benutzer nicht gefunden");
            }

            // Passwort hashen (wie beim Registrieren)            
            user.PasswordHash = _passwordHasher.HashPassword(user, request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok("Passwort erfolgreich aktualisiert");
        }
    }
}
